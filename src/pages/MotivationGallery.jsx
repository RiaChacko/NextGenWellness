import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MotivationGallery = () => {
  const [whys, setWhys] = useState([]);
  const [motivations, setMotivations] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    let unsubscribeWhys = () => {};
    let unsubscribeMotivations = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userWhysQuery = query(collection(db, "userWhys"), where("uid", "==", user.uid));
        const userMotivationQuery = query(collection(db, "userMotivation"), where("uid", "==", user.uid));

        unsubscribeWhys = onSnapshot(userWhysQuery, (snapshot) => {
          const fetchedWhys = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setWhys(fetchedWhys);
        });

        unsubscribeMotivations = onSnapshot(userMotivationQuery, (snapshot) => {
          const fetchedMotivations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMotivations(fetchedMotivations);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeWhys();
      unsubscribeMotivations();
    };
  }, []);

  if (loading) return <p>Loading motivation...</p>;

  return (
    <div className="motivation-gallery-container px-6 py-10 text-white max-w-6xl mx-auto mt-10 ml-[16vw]">
      {/* Added 'ml-[16vw]' to account for the width of the sidebar navbar */}
      <h2 className="text-2xl font-bold mb-2">Motivation Quotes</h2>
      <p className="mb-6 text-sm text-gray-300">
        Add short quotes or sayings that motivate you to keep pushing forward.
      </p>

      {/* Motivation Quotes Section */}
      <div className="flex flex-wrap gap-6 justify-start mb-12">
        {motivations.map((m, index) => (
          <div
            key={index}
            className="w-[220px] h-[140px] border-2 border-[#f472b6] rounded-2xl p-4 text-sm text-white flex items-center justify-center text-center bg-gray-800"
          >
            {m.motivation}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-2">Your Why</h2>
      <p className="mb-6 text-sm text-gray-300">
        Why are you doing this? What’s driving you?
      </p>

      {/* Your Why Section */}
      <div className="flex flex-wrap gap-6 justify-start">
        {whys.map((why, index) => (
          <div
            key={index}
            className="w-[220px] h-[140px] border-2 border-[#f472b6] rounded-2xl p-4 text-sm text-white flex items-center justify-center text-center bg-gray-800"
          >
            {why.reason}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotivationGallery;
