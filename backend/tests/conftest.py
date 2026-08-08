import pytest
import os
import sys

# Add the backend directory to sys.path so tests can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture(scope="session")
def setup_test_environment():
    """Fixture to set up any environment variables needed for tests"""
    os.environ["MOCK_RAG_DELAY"] = "0"
    yield
    # Cleanup if needed
