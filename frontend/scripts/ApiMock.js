export default class ApiMock {
	static board = {
		name: "kanban Board",
		id: "123",
		cardCount: 5,
		columns: [
			{
				name: "a fazer",
				id: "coluna-1",
				cards: [
					{
						name: "Criar mock de respostas do back",
						content: "criar bem legal 1",
						id: "arrastavel-1",
					},
					{
						name: "Testar renderização de cards",
						content: "criar bem legal 2",
						id: "arrastavel-3",
					},
					{
						name: "Sei lá",
						content: "criar bem legal 3",
						id: "arrastavel-4",
					},
				],
			},
			{
				name: "Fazendo",
				id: "coluna-2",
				cards: [
					{
						name: "Criar mock de respostas do back",
						content: "criar bem legal",
						id: "arrastavel-2",
					},
				],
			},
		],
	};

	static getBoard(id) {
		if (id == this.board.id) {
			return this.board;
		}
		return false;
	}
}
