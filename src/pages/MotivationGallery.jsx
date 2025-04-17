import React, { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import Card from "../components/Card";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// useEffect(() => {
//   const auth = getAuth();
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // Fetch data only when the user is available
//       fetchUserWhys(user.uid);
//       fetchUserMotivation(user.uid);
//     }
//   });

//   return () => unsubscribe();
// }, []);


// const MotivationGallery = () => {
//   const { currentUser } = useAuth(); // Get logged-in user
//   const [userWhys, setUserWhys] = useState([]);
//   const [userMotivation, setUserMotivation] = useState([]);

//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchUserWhys = async (uid) => {
//       const q = query(collection(db, "userWhys"), where("uid", "==", uid));
//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map((doc) => doc.data());
//       setUserWhys(data);
//     };

//     const fetchUserMotivation = async (uid) => {
//       const q = query(collection(db, "userMotivation"), where("uid", "==", uid));
//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map((doc) => doc.data());
//       setUserMotivation(data);
//     };

//     fetchUserWhys();
//     fetchUserMotivation();
//   }, [currentUser]);

//   return (
//     <div className="gallery-wrapper ml-[250px] p-6">
//       {/* "Why" Grid */}
//       <h2 className="text-2xl font-bold mb-4 text-white">Your Why</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
//         {userWhys.length > 0 ? (
//           userWhys.map((item, idx) => (
//             <Card key={idx} category="yoga">
//               <Card.Content>
//                 <p>{item.text}</p>
//               </Card.Content>
//             </Card>
//           ))
//         ) : (
//           <p className="text-white col-span-full">No reasons saved yet.</p>
//         )}
//       </div>

//       {/* Motivation Grid (quotes & media) */}
//       <h2 className="text-2xl font-bold mb-4 text-white">Your Motivation</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {userMotivation.length > 0 ? (
//           userMotivation.map((item, idx) => (
//             <Card key={idx} category="strength">
//               <Card.Content>
//                 {item.type === "quote" ? (
//                   <p>{item.quote}</p>
//                 ) : item.type === "video" ? (
//                   <video src={item.mediaUrl} controls className="rounded-lg w-full h-40 object-cover" />
//                 ) : (
//                   <img src={item.mediaUrl} alt="Motivation" className="rounded-lg w-full h-40 object-cover" />
//                 )}
//               </Card.Content>
//             </Card>
//           ))
//         ) : (
//           <p className="text-white col-span-full">No motivation saved yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

const MotivationGallery = () => {
    const [whys, setWhys] = useState([]);
    const [motivations, setMotivations] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const auth = getAuth();
  
    useEffect(() => {
      const fetchData = async (uid) => {
        try {
          const userWhysQuery = query(collection(db, "userWhys"), where("uid", "==", uid));
          const userMotivationQuery = query(collection(db, "userMotivation"), where("uid", "==", uid));
  
          const [whysSnapshot, motivationSnapshot] = await Promise.all([
            getDocs(userWhysQuery),
            getDocs(userMotivationQuery),
          ]);
  
          const fetchedWhys = whysSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const fetchedMotivations = motivationSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
          setWhys(fetchedWhys);
          setMotivations(fetchedMotivations);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching motivation data:", error);
          setLoading(false);
        }
      };
  
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchData(user.uid);
        } else {
          setLoading(false);
        }
      });
  
      return () => unsubscribe();
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
                className="w-[220px] h-[140px] border-2 border-pink-400 rounded-2xl p-4 text-sm text-white flex items-center justify-center text-center bg-gray-800"
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
                className="w-[220px] h-[140px] border-2 border-pink-400 rounded-2xl p-4 text-sm text-white flex items-center justify-center text-center bg-gray-800"
              >
                {why.reason}
              </div>
            ))}
          </div>
        </div>
      );
      
      
      
  };
  
export default MotivationGallery;
