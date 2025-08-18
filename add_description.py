import json
import requests
import urllib.parse

MOVIES_FILE = "movies.json"

def fetch_wikipedia_summary(title):
    try:
        url_title = urllib.parse.quote(title)
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{url_title}"
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        if response.status_code == 200:
            data = response.json()
            return data.get("extract")
        else:
            return None
    except Exception as e:
        print(f"Error fetching {title}: {e}")
        return None

def add_descriptions():
    with open(MOVIES_FILE, "r", encoding="utf-8") as f:
        movies = json.load(f)

    for movie in movies:
        if "description" not in movie or not movie["description"]:
            print(f"Fetching description for: {movie['title']}")
            summary = fetch_wikipedia_summary(movie["title"])
            if summary:
                movie["description"] = summary
            else:
                movie["description"] = "Description not available."

    with open(MOVIES_FILE, "w", encoding="utf-8") as f:
        json.dump(movies, f, indent=4, ensure_ascii=False)

    print("✅ Movies.json updated with Wikipedia descriptions!")

if __name__ == "__main__":
    add_descriptions()
