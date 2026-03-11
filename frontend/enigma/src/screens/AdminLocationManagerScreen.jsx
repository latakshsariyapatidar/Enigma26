import { useState, useEffect } from "react";
import LocationForm from "../components/admin/LocationForm";
import LocationList from "../components/admin/LocationList";
import api from "../utils/api";

const EMPTY_LOC = {
    name: "", qrId: "", clue: "", clueHint: "", puzzle: "", puzzleHint: "", answer: "", puzzleImageFile: null,
};

// INIT_LOCATIONS removed - fetched from backend

export default function AdminLocationManagerScreen() {
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("list"); // list | add | edit
    const [form, setForm] = useState(EMPTY_LOC);
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Fetch locations on mount
    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await api.get("/location/get-locations");
            // The backend returns an array of MongoDB documents
            const mapped = res.data.data.map((loc) => ({
                id: loc._id,
                name: loc.name,
                // qrId is not strictly in the model yet based on our inspection, but storing it locally for UI consistency:
                qrId: "QR_" + loc._id.substring(loc._id.length - 4),
                clue: loc.clue?.text || "",
                clueHint: loc.clue?.clueHint || "",
                puzzle: loc.puzzle?.text || "",
                puzzleHint: loc.puzzle?.puzzleHint || "",
                answer: loc.puzzle?.answer || "",
                puzzleImageUrl: loc.puzzle?.image || null,
            }));
            setLocations(mapped);
        } catch (err) {
            console.error("Failed to fetch locations", err);
        }
    };

    const openAdd = () => {
        setForm(EMPTY_LOC);
        setSaved(false);
        setView("add");
    };

    const saveLocation = async () => {
        if (!form.name || !form.clue || !form.answer || (!form.puzzle && !form.puzzleImageFile)) {
            setErrorMsg("Please fill required fields. Puzzle must have text or image.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("clueText", form.clue);
            if (form.clueHint) formData.append("clueHint", form.clueHint);
            if (form.puzzle) formData.append("puzzleText", form.puzzle);
            if (form.puzzleHint) formData.append("puzzleHint", form.puzzleHint);
            formData.append("answer", form.answer);
            if (form.puzzleImageFile) formData.append("puzzleImage", form.puzzleImageFile);

            const res = await api.post("/location/create-location", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const newLoc = res.data.data;

            // Add strictly mapping to UI shape
            setLocations((ls) => [...ls, {
                ...form,
                id: newLoc._id,
                qrId: "QR_" + newLoc._id.substring(newLoc._id.length - 4)
            }]);

            setSaved(true);
            setErrorMsg("");
            setTimeout(() => setView("list"), 900);
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || "Failed to save location");
        }
    };

    const deleteLocation = async (id) => {
        try {
            await api.delete(`/location/delete-location/${id}`);
            setLocations((ls) => ls.filter((l) => l.id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Failed to delete location", err);
            // Optionally set an error state here if you want to show it in the list view
        }
    };

    if (view === "add" || view === "edit") {
        return (
            <LocationForm
                view={view}
                form={form}
                setForm={setForm}
                saved={saved}
                errorMsg={errorMsg}
                editing={view === "edit"}
                locationsLength={locations.length}
                saveLocation={saveLocation}
                setView={setView}
            />
        );
    }

    return (
        <LocationList
            locations={locations}
            openAdd={openAdd}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            deleteLocation={deleteLocation}
        />
    );
}