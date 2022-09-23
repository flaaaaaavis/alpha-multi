CREATE TABLE public.usuarios(
	"id" varchar(64) NOT NULL,
	"data_criacao" TIMESTAMP NOT NULL,
	"usuario" varchar(120) NOT NULL,
	"email" varchar(120) NOT NULL,
	"senha" varchar(120) NOT NULL,
	CONSTRAINT "usuarios_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE  public.projetos (
	"id" varchar(64) NOT NULL,
	"nome" varchar(120) NOT NULL,
	"data_criacao" TIMESTAMP NOT NULL,
	"ultimo_acesso" TIMESTAMP NOT NULL,
	CONSTRAINT "projetos_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE  public.categorias (
	"id" serial NOT NULL,
	"projeto_id" varchar NOT NULL,
	"nome" varchar(30) NOT NULL,
	"data_criacao" TIMESTAMP NOT NULL,
	"ordem" integer NOT NULL,
	CONSTRAINT "categorias_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE  public.tarefas (
	"id" serial NOT NULL,
	"coluna_id" integer NOT NULL,
	"data_criacao" TIMESTAMP NOT NULL,
	"nome" varchar NOT NULL,
	"ordem" integer NOT NULL,
	"tags" varchar(255) NOT NULL,
	"anotacoes" varchar NOT NULL,
	CONSTRAINT "tarefas_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE  public.projetos_usuarios (
	"id" serial NOT NULL,
	"usuario_id" varchar NOT NULL,
	"projeto_id" varchar NOT NULL,
	"acesso_id" integer NOT NULL,
	CONSTRAINT "projetos_usuarios_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE  public.acesso (
	"id" serial NOT NULL,
	"nome" varchar(20) NOT NULL,
	CONSTRAINT "acesso_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_fk0" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id");
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_fk0" FOREIGN KEY ("coluna_id") REFERENCES "categorias"("id");
ALTER TABLE "projetos_usuarios" ADD CONSTRAINT "projetos_usuarios_fk0" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id");
ALTER TABLE "projetos_usuarios" ADD CONSTRAINT "projetos_usuarios_fk1" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id");
ALTER TABLE "projetos_usuarios" ADD CONSTRAINT "projetos_usuarios_fk2" FOREIGN KEY ("acesso_id") REFERENCES "acesso"("id");
