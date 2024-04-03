import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile
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
    updateDoc,
    setDoc,
    deleteDoc
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

    // Get the user data like his classes and role and update the state of the user
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

    // Sign up user with email and password
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

    // Add user to users collection in the firestore
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

    // Sign in user with email and password
    const singinUserWithEmailAndPass = (email, password) =>
        signInWithEmailAndPassword(firebaseAuth, email, password);

    const isLoggedIn = user ? true : false;

    // Sign out user
    const signOutUser = () => {
        try {
            firebaseAuth.signOut();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Creating a class: Utility function
    const createClassUtil = async (courseId) => {
        const classRef = collection(firestore, "classes");
        const instructorName = user.displayName;
        const newClass = {
            courseId,
            instructorName,
            students: [],
        };
        try {
            const docRef = await addDoc(classRef, newClass);
        } catch (error) {
            console.error("Error creating class: ", error);
        }
    };

    // Link class to user collection
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
    };

    // Create a new class
    const createClass = async (courseId) => {
        try {
            await createClassUtil(courseId);
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

    // Join the class
    const joinClass = async (courseId) => {
        const classRef = collection(firestore, "classes");
        try {
            const classQuery = query(classRef, where("courseId", "==", courseId));
            const classSnapshot = await getDocs(classQuery);
            if (classSnapshot.empty) {
                console.log("Class not found");
                return;
            }
            const classDoc = classSnapshot.docs[0];
            const updatedStudents = [...classDoc.data().students, user.uid];
            await updateDoc(classDoc.ref, { students: updatedStudents });
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

    // Create blog
    const addBlog = async (classId, description, attachedFile) => {
        console.log(attachedFile);
        const fileRef = ref(storage, `uploads/files/${Date.now()}-${attachedFile.name}`);
        const uploadResult = await uploadBytes(fileRef, attachedFile);
        try {
            const collectionRef = collection(firestore, 'classes', classId, 'blogs');
            const result = await addDoc(collectionRef, {
                description: description,
                attachedFileURL: uploadResult.ref.fullPath,
                userEmail: user.email,
                displayName: user.displayName,
                classId: classId
            });
        } catch (error) {
            console.error('Error adding blog: ', error);
        }
    };

    // Read Blog
    const getBlogs = async (classId) => {
        try {
            const snapshot = await getDocs(collection(firestore, 'classes', classId, 'blogs'));
            const blogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return blogs;
        } catch (error) {
            console.error('Error getting blogs: ', error);
            return [];
        }
    };

    // Update Blog
    const updateBlog = async (classId, blogId, newData) => {
        try {
            await updateDoc(doc(firestore, 'classes', classId, 'blogs', blogId), newData);
        } catch (error) {
            console.error('Error updating blog: ', error);
        }
    };

    // Delete Blog
    const deleteBlog = async (classId, blogId) => {
        try {
            await deleteDoc(doc(firestore, 'classes', classId, 'blogs', blogId));
        } catch (error) {
            console.error('Error deleting blog: ', error);
        }
    };

    // Generate download URL for the uploaded file
    const generateDownloadUrl = async (filePath) => {
        try {
            console.log(filePath);
            const storageRef = ref(storage, filePath);
            const downloadUrl = await getDownloadURL(storageRef);
            console.log(downloadUrl);
            return downloadUrl;
        } catch (error) {
            console.error('Error generating download URL: ', error);
            return null;
        }
    };

    return (
        <FirebaseContext.Provider
            value={{
                signupUserWithEmailAndPassword,
                singinUserWithEmailAndPass,
                signOutUser,
                isLoggedIn,
                user,
                joinClass,
                createClass,
                addBlog,
                getBlogs,
                generateDownloadUrl
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};