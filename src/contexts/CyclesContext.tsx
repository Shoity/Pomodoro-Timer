import {
	ReactNode,
	createContext,
	useEffect,
	useReducer,
	useState,
} from "react"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer"
import {
	InterruptCurrentCycleAction,
	MarkCurrentCycleAsFinishedAction,
	addNewCycleAction,
} from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"

interface CreateCycleData {
	task: string
	minutesAmount: number
}

interface CycleContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPast: number
	markCurrentCycleAsFinished: () => void
	setSecondsPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleData) => void
	interruptCurrentCycle: () => void
}

interface CyclesContextProps {
	children: ReactNode
}

export const CyclesContext = createContext({} as CycleContextType)

export function CyclesContextProvider({ children }: CyclesContextProps) {
	const [cyclesState, dispatch] = useReducer(
		cyclesReducer,
		{
			cycles: [],
			activeCycleId: null,
		},
		(initialState) => {
			const storedStateAsJSON = localStorage.getItem(
				"@ignite-timer:cycles-state-1.0.0"
			)
			if (storedStateAsJSON) {
				return JSON.parse(storedStateAsJSON)
			}

			return initialState
		}
	)

	const { cycles, activeCycleId } = cyclesState
	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	const [amountSecondsPast, setAmountSecondsPast] = useState(() => {
		if (activeCycle) {
			return differenceInSeconds(
				new Date(),
				new Date(activeCycle.startDate)
			)
		}
		return 0
	})

	useEffect(() => {
		const stateJSON = JSON.stringify(cyclesState)

		localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON)
	}, [cyclesState])

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPast(seconds)
	}

	function markCurrentCycleAsFinished() {
		dispatch(MarkCurrentCycleAsFinishedAction())
	}

	function createNewCycle(data: CreateCycleData) {
		const id = String(new Date().getTime())
		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		dispatch(addNewCycleAction(newCycle))
		setAmountSecondsPast(0)
	}

	function interruptCurrentCycle() {
		dispatch(InterruptCurrentCycleAction())
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				amountSecondsPast,
				setSecondsPassed,
				createNewCycle,
				interruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	)
}
