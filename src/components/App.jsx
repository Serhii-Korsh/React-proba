import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "./SearchBar/SearchBar";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import ImageGallery from "./ImageGallery/ImageGallery";
import Loader from "./Loader/Loader";
import LoadMoreBtn from "./LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./ImageModal/ImageModal";

const ACCESS_KEY = "_n-WbaYYa46dr_uXsPI1IKic8i9afKM0-wnW4vh-ACg";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (query) {
      fetchImages();
    }
  }, [query, page]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: { query, page, per_page: 12 },
          headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
        }
      );
      setImages((prevImages) => [...prevImages, ...response.data.results]);
      setError(null);
    } catch (error) {
      setError(`Could not fetch images. Try again later.${error.message}`);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (inputQuery) => {
    if (!inputQuery.trim()) {
      toast.error("Please enter a search term!");
      return;
    }
    setQuery(inputQuery);
    setImages([]);
    setPage(1);
    setError(null);
  };

  const loadMoreImages = () => setPage((prevPage) => prevPage + 1);
  const openModal = (image) => {
    setModalImage(image);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  return (
    <div>
      <Toaster />
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage message={error} />}
      <ImageGallery images={images} onImageClick={openModal} />
      {loading && <Loader />}
      {images.length > 0 && !loading && (
        <LoadMoreBtn onClick={loadMoreImages} />
      )}
      {showModal && <ImageModal image={modalImage} onClose={closeModal} />}
    </div>
  );
};

export default App;
