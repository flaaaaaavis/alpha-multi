export default class Project{
	static project = {
		project_name: 'novo quadro',
		project_id: Math.floor(Math.random() * 1000000),
		columns: []
	};

	static changeName(_name){
		this.project.project_name = _name;
	}
}
