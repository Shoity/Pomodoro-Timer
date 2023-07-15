import { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { FormContainer, TaskInput, MinutesAmountInput } from "./styles"
import { CyclesContext } from "../../../../contexts/CyclesContext"

export function NewCycleForm() {
	const { activeCycle } = useContext(CyclesContext)
	const { register } = useFormContext()

	return (
		<FormContainer>
			<label htmlFor="task">Vou trabalhar em</label>
			<TaskInput
				id="task"
				list="taskSuggestions"
				placeholder="Dê um nome para o seu projeto"
				disabled={!!activeCycle}
				{...register("task")}
			/>
			<datalist id="taskSuggestions">
				<option value="Projeto" />
			</datalist>

			<label htmlFor="minutesAmount"> durante</label>
			<MinutesAmountInput
				type="number"
				id="minutesAmount"
				placeholder="00"
				step={5}
				min={1}
				max={60}
				disabled={!!activeCycle}
				{...register("minutesAmount", { valueAsNumber: true })}
			/>
		</FormContainer>
	)
}
