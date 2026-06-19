import numpy as np
from typing import AsyncIterator
from app.ai.embedding_service import EmbeddingService
from app.ai.llm_service import LLMService
from app.core.database import (
    projects_collection, showcases_collection,
    student_profiles_collection, achievements_collection
)


class RAGService:
    def __init__(self):
        self.embed_svc = EmbeddingService()
        self.llm = LLMService()

    async def _retrieve_context(self, query: str, k: int = 5) -> str:
        query_vec = self.embed_svc.embed(query)
        context_parts = []

        # Retrieve relevant projects (text search fallback)
        cursor = projects_collection().find(
            {"$text": {"$search": query}} if False else {},
            limit=k
        ).limit(k)
        async for doc in cursor:
            context_parts.append(f"Project: {doc['title']} - {doc['description'][:200]}")

        # Retrieve showcases
        cursor2 = showcases_collection().find({}).limit(3)
        async for doc in cursor2:
            context_parts.append(f"Showcase: {doc.get('project_title', '')} - {doc.get('description', '')[:150]}")

        return "\n".join(context_parts)

    async def chat(self, messages: list, context_type: str = None) -> str:
        last_query = messages[-1].content if messages else ""
        rag_context = await self._retrieve_context(last_query)

        system = f"""You are Edu AI, an intelligent academic assistant for ProjectVerse AI platform.
You help students with project guidance, coding help, career guidance, placement preparation,
interview preparation, technology roadmaps, project suggestions, and research assistance.

Relevant platform context:
{rag_context}

Be concise, helpful, and encouraging. Focus on academic and technical excellence."""

        conversation = [{"role": m.role, "content": m.content} for m in messages]
        response = self.llm.client.chat.completions.create(
            model=self.llm.model,
            messages=[{"role": "system", "content": system}] + conversation,
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content

    async def stream_chat(self, messages: list) -> AsyncIterator[str]:
        last_query = messages[-1].content if messages else ""
        rag_context = await self._retrieve_context(last_query)
        system = f"""You are Edu AI, an intelligent academic assistant for ProjectVerse AI.
Help students with project guidance, coding, career, and placement prep.
Context: {rag_context[:500]}"""

        conversation = [{"role": m.role, "content": m.content} for m in messages]
        stream = self.llm.client.chat.completions.create(
            model=self.llm.model,
            messages=[{"role": "system", "content": system}] + conversation,
            max_tokens=1024,
            temperature=0.7,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
