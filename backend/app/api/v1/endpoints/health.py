from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Health Check")
def health_check():
    return {
        "status": "healthy",
        "service": "EcoAction AI API",
        "version": "0.1.0",
    }
