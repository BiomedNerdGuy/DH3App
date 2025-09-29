from flask import Flask, request, jsonify
from google.cloud import firestore
from datetime import datetime, timedelta
import os
from flask_cors import CORS

app = Flask(__name__)
db = firestore.Client()
CORS(app)
    
@app.route("/heartrate", methods=["POST"])
def post_data():
    """Store biometric data (HR, ACC, BP, notes, etc.) into Firestore 'heartrate' collection"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        # Ensure timestamp exists
        if "timestamp" not in data:
            data["timestamp"] = datetime.utcnow().isoformat()

        # Add serverTimestamp for backend reference
        data["serverTimestamp"] = datetime.utcnow().isoformat()

        # Save to Firestore
        db.collection("heartrate").add(data)

        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/heartrate", methods=["GET"])
def get_data():
    """Retrieve data by type (default=heartrate) within last N hours"""
    try:
        hours = int(request.args.get("hours", 24))
        data_type = request.args.get("type", "heartrate")  # default = heartrate

        since = datetime.utcnow() - timedelta(hours=hours)

        docs = (
            db.collection("heartrate")
              .where("dataType", "==", data_type)
              .where("timestamp", ">=", since.isoformat())
              .order_by("timestamp")
              .stream()
        )

        results = [doc.to_dict() for doc in docs]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "✅ Heart Rate API is running", 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

