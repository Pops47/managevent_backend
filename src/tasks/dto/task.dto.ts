import { IsNotEmpty } from "class-validator";

export class Task {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}