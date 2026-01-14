import { category } from "./categoryModel";
import { session } from "./sessionModel";

export interface movie {
    title: string,
    description: string,
    categories: category[],
    sessions: session[]
}