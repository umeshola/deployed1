'use client'

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_PHOTO } from "../graphql/quries"; // Adjust the import path accordingly
import { CHANGE_TITLE, DELETE_PHOTO } from "../graphql/quries"; // Add your mutations here
import { equal } from "assert";

export default function Home() {
    const { loading, error, data } = useQuery(ALL_PHOTO);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null); // State to track selected photo
    const [newTitle, setNewTitle] = useState(''); // State to track title input

    const [updatePhoto] = useMutation(CHANGE_TITLE); // Mutation to update photo title
    const [deletePhoto] = useMutation(DELETE_PHOTO); // Mutation to delete photo

    // Handle loading and error states
    if (loading) return <p className="text-xl text-center">Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Function to handle click on an image
    const handleImageClick = (photo: any) => {
        setSelectedPhoto(photo); // Set the clicked photo as selected
        setNewTitle(photo.title); // Set the title for editing
    };

    // Function to save the edited title
    const handleSaveTitle = () => {
        updatePhoto({
            variables: { changeTitleId: selectedPhoto.id, title: newTitle },
            refetchQueries: [{ query: ALL_PHOTO }] // Refetch after update
        });
        setSelectedPhoto(null); // Close the modal or detailed view
    };

    // Function to delete the photo
    const handleDeletePhoto = async () => {
        const ans = await deletePhoto({
            variables: { deletePhotoId: selectedPhoto.id },
            refetchQueries: [{ query: ALL_PHOTO }] // Refetch after deletion
        });
        if (ans.data?.deletePhoto === "You are not the owner") {
            alert("You are not the owner of this photo");
        }
        setSelectedPhoto(null); // Close the modal or detailed view
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {data.allImg.map((photo: any) => (
                <div
                    key={photo.id}
                    className="border rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(photo)}
                >
                    <img src={photo.image} alt={photo.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">{photo.title}</h2>
                        <p className="text-gray-600">Uploaded by: {photo.owner.name}</p>
                    </div>
                </div>
            ))}

            {/* Modal/Detailed view for selected photo */}
            {selectedPhoto && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                        <img src={selectedPhoto.image} alt={selectedPhoto.title} className="w-full h-48 object-cover" />
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="mt-4 p-2 bg-neutral-600 border rounded w-full"
                            placeholder="Enter new title"
                        />
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleSaveTitle}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save Title
                            </button>
                            <button
                                onClick={handleDeletePhoto}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete Photo
                            </button>
                        </div>
                        <button
                            onClick={() => setSelectedPhoto(null)} // Close the modal
                            className="mt-4 text-gray-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
