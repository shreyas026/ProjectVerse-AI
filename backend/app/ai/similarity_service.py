import numpy as np
from app.ai.embedding_service import EmbeddingService
from app.core.database import projects_collection, project_embeddings_collection, showcases_collection


class SimilarityService:
    def __init__(self):
        self.embed_svc = EmbeddingService()

    async def find_similar_projects(self, title: str, description: str, tech_stack: list) -> dict:
        query_text = f"{title} {description} {' '.join(tech_stack)}"
        query_vec = self.embed_svc.embed(query_text)

        # Load all stored embeddings and compare
        similar = []
        async for emb_doc in project_embeddings_collection().find({}):
            stored_vec = np.array(emb_doc["vector"])
            score = float(np.dot(query_vec, stored_vec))
            if score > 0.5:
                project = await projects_collection().find_one({"_id": emb_doc["project_id"] if "project_id" in emb_doc else None})
                if project:
                    showcase = await showcases_collection().find_one({"project_id": str(project["_id"])})
                    similar.append({
                        "project_id": str(project["_id"]),
                        "title": project["title"],
                        "owner_name": project.get("owner_name", ""),
                        "similarity_score": round(score * 100, 1),
                        "quality_score": project.get("quality_score"),
                        "originality_score": project.get("originality_score"),
                        "showcase_id": str(showcase["_id"]) if showcase else None,
                        "created_at": str(project.get("created_at", "")),
                    })

        similar.sort(key=lambda x: x["similarity_score"], reverse=True)
        top = similar[:5]
        max_sim = top[0]["similarity_score"] if top else 0
        originality = round(100 - max_sim, 1)

        recommendation = "Highly original project!" if originality > 80 else (
            "Similar projects exist. Consider differentiating your approach." if originality > 50 else
            "Very similar to existing projects. Major differentiation required."
        )

        return {
            "similar_projects": top,
            "originality_score": originality,
            "similarity_score": max_sim,
            "recommendation": recommendation,
        }

    async def bulk_compare(self, projects: list) -> list:
        """Compare all projects in a class against each other."""
        texts = [f"{p['title']} {p['description']}" for p in projects]
        if not texts:
            return []

        vecs = self.embed_svc.embed_batch(texts)
        report = []
        for i, project in enumerate(projects):
            max_sim = 0
            most_similar = None
            for j, other in enumerate(projects):
                if i == j:
                    continue
                sim = float(np.dot(vecs[i], vecs[j]))
                if sim > max_sim:
                    max_sim = sim
                    most_similar = other

            sim_pct = round(max_sim * 100, 1)
            status = "Duplicate" if sim_pct > 85 else ("Very Similar" if sim_pct > 65 else "Original")
            report.append({
                "project_id": project["id"],
                "project_title": project["title"],
                "owner_name": project.get("owner_name", ""),
                "similarity_score": sim_pct,
                "most_similar_project": most_similar["title"] if most_similar else None,
                "duplicate_status": status,
                "recommendation": "Needs major revision" if status == "Duplicate" else (
                    "Consider differentiating" if status == "Very Similar" else "Good originality"
                ),
            })
        return sorted(report, key=lambda x: x["similarity_score"], reverse=True)
