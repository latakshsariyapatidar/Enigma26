import { useState, useEffect } from "react";
import LocationForm from "../components/admin/LocationForm";
import LocationList from "../components/admin/LocationList";
import api from "../utils/api";

const EMPTY_LOC = {
    name: "", qrId: "", clue: "", clueHint: "", puzzleType: "riddle", puzzle: "", puzzleHint: "", answer: "", hasImage: false,
};

const INIT_LOCATIONS = [
    { id: 1, name: "Library", qrId: "QR_001", clue: "Where knowledge flows but never speaks…", clueHint: "Think books and silence.", puzzleType: "riddle", puzzle: "I have cities but no houses…", puzzleHint: "Something you navigate with.", answer: "map", hasImage: false },
    { id: 2, name: "Canteen", qrId: "QR_002", clue: "Where hunger meets chatter at midday…", clueHint: "Everyone goes here for lunch.", puzzleType: "cipher", puzzle: "DBOUFFO → ?", puzzleHint: "Shift each letter back by one.", answer: "canteen", hasImage: false },
    { id: 3, name: "Lab Block", qrId: "QR_003", clue: "Where circuits hum and code runs free…", clueHint: "Think computers and experiments.", puzzleType: "image", puzzle: "Identify the landmark in the image.", puzzleHint: "Look at the rooftop shape.", answer: "lab block", hasImage: true },
];

export default function AdminLocationManagerScreen() {
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("list"); // list | add | edit
    const [form, setForm] = useState(EMPTY_LOC);
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const PUZZLE_TYPES = ["riddle", "cipher", "image", "logic"];

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
                puzzleType: loc.puzzle?.type || "riddle",
                puzzle: loc.puzzle?.text || "",
                puzzleHint: loc.puzzle?.puzzleHint || "",
                answer: loc.puzzle?.answer || "",
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
        if (!form.name || !form.clue || !form.answer) {
            setErrorMsg("Please fill required fields");
            return;
        }

        try {

            // Create Flow
            const payload = {
                name: form.name,
                clueText: form.clue,
                clueHint: form.clueHint,
                puzzleText: form.puzzle,
                puzzleHint: form.puzzleHint,
                answer: form.answer,
            };

            const res = await api.post("/location/create-location", payload);
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
                PUZZLE_TYPES={PUZZLE_TYPES}
                saved={saved}
                errorMsg={errorMsg}
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