from flask import Flask, request
from revieweditems import ReviewedItemDB

app = Flask(__name__)

# handles cors for put and delete
@app.route("/contents/<int:content_id>", methods=["OPTIONS"])
def handle_cors_options_for_content(content_id):
    return "", 204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

#handles cors for post
@app.route("/contents", methods=["OPTIONS"])
def handle_cors_options_for_collection():
    return "", 204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
    }

#retrieves reviews
@app.route("/contents", methods=["GET"])
def retrieve_contents():
    db = ReviewedItemDB("revieweditems_db.db")
    reviewed_items = db.getReviewedItems()
    return reviewed_items, 200, {"Access-Control-Allow-Origin": "*"}

#retrieves single review
@app.route("/contents/<int:content_id>", methods=["GET"])
def retrieve_content(content_id):
    db = ReviewedItemDB("revieweditems_db.db")
    content = db.getReviewedItem(content_id)
    
    if content:
        return content, 200, {"Access-Control-Allow-Origin": "*"}
    else:
        return {"error": f"Content Review with ID {content_id} not found"}, 404, {"Access-Control-Allow-Origin": "*"}


#creates reviews
@app.route("/contents", methods=["POST"])
def create_content():
    content_type = request.form.get("content_type")
    name = request.form.get("name")
    rating = request.form.get("rating")
    release_year = request.form.get("release_year")
    genre = request.form.get("genre")
    
    db = ReviewedItemDB("revieweditems_db.db")
    db.createReviewedItem(content_type, name, rating, release_year, genre)
    return "Created", 201, {"Access-Control-Allow-Origin": "*"}

#updates reviews
@app.route("/contents/<int:content_id>", methods=["PUT"])
def update_content(content_id):
    content_type = request.form.get("content_type")
    name = request.form.get("name")
    rating = request.form.get("rating")
    release_year = request.form.get("release_year")
    genre = request.form.get("genre")
    
    db = ReviewedItemDB("revieweditems_db.db")
    db.updateContent(content_type, name, rating, release_year, genre, content_id)
    return "Updated", 200, {"Access-Control-Allow-Origin": "*"}

#deletes reviews
@app.route("/contents/<int:content_id>", methods=["DELETE"])
def delete_content(content_id):
    db = ReviewedItemDB("revieweditems_db.db")
    db.deleteReviewedItem(content_id)
    return "Deleted", 200, {"Access-Control-Allow-Origin": "*"}

def run():
    app.run(port=8080, host='0.0.0.0')

if __name__ == "__main__":
    run()
