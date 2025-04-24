import { createContext } from "react";
import type { TrackContextType } from "../types/TrackContextType";

export const TrackContext = createContext<TrackContextType | null>(null);
