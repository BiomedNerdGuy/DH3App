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
    """Retrieve all heart rate data without strict filtering"""
    try:
        # Get all documents without time filtering first
        docs = (
            db.collection("heartrate")
              .order_by("timestamp", direction=firestore.Query.DESCENDING)
              .limit(100)
              .stream()
        )

        results = []
        for doc in docs:
            doc_data = doc.to_dict()
            # Include all documents, let dashboard filter if needed
            results.append(doc_data)
        
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/debug", methods=["GET"])
def debug():
    """Debug endpoint to check Firestore data structure"""
    try:
        # Get first 5 documents to analyze structure
        docs = list(db.collection("heartrate").limit(5).stream())
        
        debug_info = {
            "total_documents_checked": len(docs),
            "sample_documents": []
        }
        
        for doc in docs:
            data = doc.to_dict()
            debug_info["sample_documents"].append({
                "document_id": doc.id,
                "fields_present": list(data.keys()),
                "timestamp": data.get("timestamp"),
                "serverTimestamp": data.get("serverTimestamp"),
                "dataType": data.get("dataType"),
                "heartRate": data.get("heartRate"),
                "heart_rate": data.get("heart_rate"),
                "device": data.get("device"),
                "userId": data.get("userId")
            })
        
        # Also count total documents
        total_docs = len(list(db.collection("heartrate").stream()))
        debug_info["total_documents_in_collection"] = total_docs
        
        return jsonify(debug_info), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/heartrate/raw", methods=["GET"])
def get_raw_data():
    """Get raw data without any processing for debugging"""
    try:
        docs = db.collection("heartrate").limit(10).stream()
        
        results = []
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data["_firestore_id"] = doc.id
            results.append(doc_data)
        
        return jsonify({
            "count": len(results),
            "documents": results
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/heartrate/filtered", methods=["GET"])
def get_filtered_data():
    """Get data with original filtering logic for comparison"""
    try:
        hours = int(request.args.get("hours", 24))
        data_type = request.args.get("type", "heartrate")

        since = datetime.utcnow() - timedelta(hours=hours)

        docs = (
            db.collection("heartrate")
              .where("dataType", "==", data_type)
              .where("timestamp", ">=", since.isoformat())
              .order_by("timestamp")
              .stream()
        )

        results = [doc.to_dict() for doc in docs]
        return jsonify({
            "filter_applied": {
                "hours": hours,
                "data_type": data_type,
                "since": since.isoformat()
            },
            "results_count": len(results),
            "results": results
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Heart Rate API is running - Use /debug to check data structure", 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
