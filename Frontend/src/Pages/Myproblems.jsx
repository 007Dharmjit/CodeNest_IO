import {  useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const MyProblem = () => {
  const { userData, } = useAuth();
  const [problem, setProblem] = useState({
    problmName: "",
    description: "",
    images: [],
    imagePreviews: [],
  });
  const [isLoading, setIsLoading] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setProblem((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data to send to the backend
    const formData = new FormData();
    formData.append("name", problem.problmName);
    formData.append("description", problem.description);
    formData.append("userID", userData.id);
    formData.append("uploadedByuser", userData.username);
    // Append each selected image file
    problem.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setIsLoading(true);
      // Send the POST request to your API endpoint
      await axios.post(
        "http://localhost:3001/api/users/upload-problem",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Problem uploaded successfully!", {
        position: "top-center",
        autoClose: 1500,
      });
      setProblem({
        problmName: "",
        description: "",
        images: [],
        imagePreviews: [],
      });
    } catch {
      toast.error("Error uploading image. Please try again.", {
        position: "top-center",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="max-w-2xl mx-auto p-6 bg-zinc-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Upload Your Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Problem Name</label>
            <input
              type="text"
              name="problmName"
              placeholder="Problem name"
              value={problem.problmName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 bg-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={problem.description}
              placeholder="Description about problem."
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 bg-transparent outline-none"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label className="block font-medium">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-fit p-2 border rounded mt-1 bg-transparent outline-none"
            />
          </div>
          {problem.imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {problem.imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded border"
                  />
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProblem;
