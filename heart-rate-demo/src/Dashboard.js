import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
  const q = collection(db, "heart_rate");
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => doc.data());
    docs.sort((a, b) => a.timestamp - b.timestamp);

    console.log("🔥 Firestore data from frontend:", docs); // 👈 前端打印

    setData(docs);
  });
  return () => unsubscribe();
}, []);


  return (
    <div>
      <h2>💓 Heart Rate Dashboard</h2>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
        dataKey="timestamp" 
        tickFormatter={(unixTime) =>
          new Date(unixTime * 1000).toLocaleTimeString()
        }
/>
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="heart_rate" stroke="#ff0000" />
      </LineChart>
    </div>
  );
}
