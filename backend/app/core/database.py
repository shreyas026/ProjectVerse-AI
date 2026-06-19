from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.mongodb_uri)
    print(f"✅ Connected to MongoDB: {settings.database_name}")


async def close_db():
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed")


def get_db():
    return client[settings.database_name]


# Collection helpers
def users_collection():
    return get_db()["users"]

def student_profiles_collection():
    return get_db()["student_profiles"]

def faculty_profiles_collection():
    return get_db()["faculty_profiles"]

def projects_collection():
    return get_db()["projects"]

def project_embeddings_collection():
    return get_db()["project_embeddings"]

def showcases_collection():
    return get_db()["showcases"]

def achievements_collection():
    return get_db()["achievements"]

def achievement_scores_collection():
    return get_db()["achievement_scores"]

def quality_reports_collection():
    return get_db()["quality_reports"]

def originality_reports_collection():
    return get_db()["originality_reports"]

def teams_collection():
    return get_db()["teams"]

def team_requests_collection():
    return get_db()["team_requests"]

def tasks_collection():
    return get_db()["tasks"]

def messages_collection():
    return get_db()["messages"]

def notifications_collection():
    return get_db()["notifications"]

def comments_collection():
    return get_db()["comments"]

def likes_collection():
    return get_db()["likes"]

def impact_scores_collection():
    return get_db()["impact_scores"]

def faculty_reviews_collection():
    return get_db()["faculty_reviews"]

def analytics_collection():
    return get_db()["analytics"]
