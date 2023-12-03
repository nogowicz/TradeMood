import { InstrumentProps } from "store/InstrumentProvider";

export type RootStackParamList = {
    [key: string]: undefined |
    {
        instrument?: InstrumentProps,
        userUID?: string;
    }

}
