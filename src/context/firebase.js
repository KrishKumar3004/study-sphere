import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth";
import { updateDoc, setDoc } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyBzNyM5L_wKG20p5MQUaMmR8zW-I7ylj6o",
    authDomain: "studysphere-ca2cf.firebaseapp.com",
    projectId: "studysphere-ca2cf",
    storageBucket: "studysphere-ca2cf.appspot.com",
    messagingSenderId: "382905642762",
    appId: "1:382905642762:web:4a7f7e5b2b56ff96f294f3"
};

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                getUserData(user.email);
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    const getUserData = async (email) => {
        const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const classesData = await Promise.all(
                userData.classes.map(async (classId) => {
                    const classDoc = await getDoc(doc(firestore, 'classes', classId));
                    return { id: classId, ...classDoc.data() };
                })
            );
            setUser((prevUser) => ({
                ...prevUser,
                classes: classesData,
                role: userData.role || 'Student',
            }));
        }
    };


    const signupUserWithEmailAndPassword = async (email, password, fullName, role) => {
        try {
            const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            await updateProfile(credential.user, {
                displayName: fullName,
            });
            await createUserCollection(fullName, email, [], role);
            return credential;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };



    const singinUserWithEmailAndPass = (email, password) =>
        signInWithEmailAndPassword(firebaseAuth, email, password);

    const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

    const isLoggedIn = user ? true : false;

    const logoutUser = () => {
        try {
            firebaseAuth.signOut();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const linkClassToUser = async (courseId) => {
        const classRef = collection(firestore, "classes");
        const instructorName = user.displayName;
        const newClass = {
            courseId,
            instructorName,
            students: [],
            blogs: []
        };

        try {
            const docRef = await addDoc(classRef, newClass);
            console.log("New class created with ID: ", docRef.id);

        } catch (error) {
            console.error("Error creating class: ", error);
        }
    };
    const linkUserToCreatedClass = async (classId) => {
        const userQuery = query(collection(firestore, "users"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.empty) {
            console.log("User not found");
            return;
        }
        const userDoc = userSnapshot.docs[0];
        const updatedClasses = [...userDoc.data().classes, classId];
        await updateDoc(userDoc.ref, { classes: updatedClasses });

        console.log("Updated user classes successfully");
    };
    const createClass = async (courseId) => {
        try {
            await linkClassToUser(courseId);
            const classQuery = query(collection(firestore, "classes"), where("courseId", "==", courseId));
            const classSnapshot = await getDocs(classQuery);
            if (classSnapshot.empty) {
                console.log("Class not found");
                return;
            }
            const classDoc = classSnapshot.docs[0];
            await linkUserToCreatedClass(classDoc.id);
        } catch (error) {
            console.error("Error creating class: ", error);
        }
    }
    const joinClass = async (courseId) => {
        const classRef = collection(firestore, "classes");

        try {
            // Get the class document with the given courseId
            const classQuery = query(classRef, where("courseId", "==", courseId));
            const classSnapshot = await getDocs(classQuery);
            if (classSnapshot.empty) {
                console.log("Class not found");
                return;
            }
            const classDoc = classSnapshot.docs[0];

            // Add the student to the class
            const updatedStudents = [...classDoc.data().students, user.uid];
            await updateDoc(classDoc.ref, { students: updatedStudents });

            console.log("Joined class successfully");

            const userQuery = query(collection(firestore, "users"), where("email", "==", user.email));
            const userSnapshot = await getDocs(userQuery);
            if (userSnapshot.empty) {
                console.log("User not found");
                return;
            }
            const userDoc = userSnapshot.docs[0];
            const updatedClasses = [...userDoc.data().classes, classDoc.id];
            await updateDoc(userDoc.ref, { classes: updatedClasses });

            console.log("Updated user classes successfully");
        } catch (error) {
            console.error("Error joining class: ", error);
        }
    };
    const createUserCollection = async (fullName, email, classes, role) => {
        const userCollectionRef = collection(firestore, "users");
        const newUser = {
            fullName,
            email,
            classes: [],
            role,

        };
        try {
            const docRef = await addDoc(userCollectionRef, newUser);
            console.log("New user created with ID: ", docRef.id);
        } catch (error) {
            console.error("Error creating user: ", error);
        }
    };
    return (
        <FirebaseContext.Provider
            value={{
                signinWithGoogle,
                signupUserWithEmailAndPassword,
                singinUserWithEmailAndPass,
                joinClass,
                createClass,
                isLoggedIn,
                user,
                logoutUser
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};