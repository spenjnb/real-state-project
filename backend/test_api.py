import requests
import json

def test_api_endpoints():
    # Use 127.0.0.1 instead of localhost
    base_url = "http://127.0.0.1:8000"
    
    # Test root endpoint
    print("\nTesting root endpoint:")
    try:
        response = requests.get(f"{base_url}/")
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error testing root endpoint: {str(e)}")
    
    # Test /api/properties endpoint
    print("\nTesting /api/properties endpoint:")
    try:
        response = requests.get(f"{base_url}/api/properties")
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error testing /api/properties endpoint: {str(e)}")
    
    # Test /api/sales endpoint
    print("\nTesting /api/sales endpoint:")
    try:
        response = requests.get(f"{base_url}/api/sales")
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error testing /api/sales endpoint: {str(e)}")
    
    # Test /api/renovations endpoint
    print("\nTesting /api/renovations endpoint:")
    try:
        response = requests.get(f"{base_url}/api/renovations")
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error testing /api/renovations endpoint: {str(e)}")

if __name__ == "__main__":
    test_api_endpoints() 