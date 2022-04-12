import {InferActionsTypes, ThunkType} from "./store_redux";
import {CompetitionType} from "../../types/match";
import {TournamentAPI} from "../api/TournamentAPI";

const initialState = {
    types: null as CompetitionType[],
};

type CompetitionInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actionsCompetition>;
type getThunkType = ThunkType<ActionsType>

export const competition_reducer = (
    state = initialState,
    action: ActionsType
): CompetitionInitialStateType => {
    switch (action.type) {
        case "GSLF/COMPETITION/SET_COMPETITION_TYPES": {
            return {
                ...state,
                types: action.types,
            };
        }
        default:
            return {...state};
    }
};

export const actionsCompetition = {
    setTypes: (types: CompetitionType[]) =>
        ({type: "GSLF/COMPETITION/SET_COMPETITION_TYPES", types} as const),
};

export const getCompetitionTypes = (): getThunkType => async (dispatch) => {
    try {
        let res = await TournamentAPI.getCompetitionsTypes()
        if(res) {
            dispatch(actionsCompetition.setTypes(res.map(item => ({...item, value: item.id, label: item.name}))))
        }
    } catch (e ) {}
}
