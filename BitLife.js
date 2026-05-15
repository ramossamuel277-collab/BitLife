"use strict";

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const formatMoney = (value) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
}).format(value);

const names = [
  "Ana Souza", "Bianca Rocha", "Caio Lima", "Davi Martins",
  "Elisa Nunes", "Luna Ferreira", "Mateus Costa", "Rafa Almeida",
  "Marina Azevedo", "Igor Santana", "Noah Ribeiro", "Yasmin Duarte"
];

const lifeEvents = {
  child: [
    { text: "Voce ganhou um brinquedo usado que virou seu favorito.", effect: { happiness: 5, relationships: 2 } },
    { text: "Uma febre derrubou sua energia por alguns dias.", effect: { health: -4, stress: 2 } },
    { text: "Alguem da familia leu historias para voce antes de dormir.", effect: { smarts: 3, relationships: 3 } }
  ],
  teen: [
    { text: "Uma amizade ficou mais forte depois de uma conversa sincera.", effect: { happiness: 6, relationships: 5 } },
    { text: "Boatos na escola incomodaram mais do que voce esperava.", effect: { happiness: -5, stress: 6 } },
    { text: "Voce descobriu um talento novo em uma atividade escolar.", effect: { smarts: 4, reputation: 3 } }
  ],
  adult: [
    { text: "Uma despesa inesperada apareceu no pior momento.", effect: { money: -180, stress: 5 } },
    { text: "Um contato antigo indicou uma oportunidade pequena, mas promissora.", effect: { reputation: 4, money: 160 } },
    { text: "Voce teve uma semana de bons habitos e dormiu melhor.", effect: { health: 5, stress: -4 } }
  ]
};

const stories = {
  linhaBase: {
    icon: "LB",
    title: "Linha de Base",
    summary: "Nasca em um bairro periferico e tente transformar talento em oportunidade.",
    bio: "Nascida em uma familia trabalhadora, voce aprende cedo a equilibrar afeto, pressao e ambicao.",
    modifiers: { money: 20, happiness: 4, stress: 2, smarts: 5, relationships: 6 },
    chapters: [
      chapter(0, "Nascimento", "Primeiro choro", "Voce nasceu em uma casa apertada, cheia de gente opinando e tentando ajudar.", [
        opt("Ser um bebe tranquilo", "+ saude, + relacoes", { health: 4, relationships: 5 }, 1),
        opt("Chorar muito", "+ cuidado, + estresse familiar", { health: 2, stress: 5, relationships: 2 }, 1),
        opt("Adoecer cedo", "- saude, + uniao familiar", { health: -8, relationships: 7, stress: 4 }, 1)
      ]),
      chapter(3, "Primeira infancia", "Creche ou casa da avo", "Sua familia precisa decidir onde voce passa o dia enquanto os adultos trabalham.", [
        opt("Ir para a creche", "+ inteligencia, + amizades", { smarts: 8, relationships: 4 }, 3),
        opt("Ficar com a avo", "+ felicidade, + familia", { happiness: 7, relationships: 7 }, 3),
        opt("Revezar entre vizinhos", "+ independencia, + estresse", { smarts: 4, stress: 5, relationships: 3 }, 3)
      ]),
      chapter(6, "Escola", "A professora percebe algo", "Voce aprende rapido, mas nem sempre tem material, silencio ou internet em casa.", [
        opt("Pedir livros emprestados", "+ inteligencia", { smarts: 12, reputation: 2 }, 6),
        opt("Brincar mais no recreio", "+ felicidade, + relacoes", { happiness: 7, relationships: 5 }, 6),
        opt("Esconder dificuldades", "- felicidade, + estresse", { happiness: -5, stress: 7 }, 6)
      ]),
      chapter(10, "Infancia", "Campeonato da escola", "Uma olimpiada escolar pode abrir portas, mas tambem expor sua inseguranca.", [
        opt("Competir", "+ inteligencia, + reputacao", { smarts: 14, reputation: 6, stress: 4 }, 10),
        opt("Torcer pelos amigos", "+ relacoes, + felicidade", { relationships: 8, happiness: 6 }, 10),
        opt("Treinar escondido", "+ inteligencia, - estresse", { smarts: 8, stress: -2 }, 10)
      ]),
      chapter(14, "Adolescencia", "Primeiro bico", "Um trabalho no fim de semana pode ajudar nas contas, mas rouba tempo de descanso.", [
        opt("Aceitar o bico", "+ dinheiro, + responsabilidade", { money: 420, stress: 9, reputation: 3 }, 14),
        opt("Focar na escola", "+ estudo, - dinheiro", { smarts: 12, education: 8, money: -40 }, 14),
        opt("Dividir tempo", "+ equilibrio", { money: 190, smarts: 5, stress: 4 }, 14)
      ]),
      chapter(17, "Vestibular", "A escolha do futuro", "Todo mundo pergunta o que voce vai ser, como se voce ja tivesse certeza.", [
        opt("Tentar universidade publica", "+ estudo, + estresse", { education: 15, smarts: 10, stress: 8 }, 17),
        opt("Curso tecnico", "+ carreira rapida", { education: 9, money: 160, reputation: 4 }, 17),
        opt("Trabalhar primeiro", "+ dinheiro, - estudo", { money: 680, education: -4, stress: 6 }, 17)
      ]),
      chapter(18, "Maioridade", "RG na mao", "Voce completa 18 anos e sente a liberdade chegando junto com boletos.", [
        opt("Sair de casa", "+ autonomia, - dinheiro", { happiness: 8, money: -500, stress: 9 }, 18, { home: "Quarto alugado" }),
        opt("Ficar com a familia", "+ economia, + relacoes", { money: 280, relationships: 6, stress: -2 }, 18),
        opt("Morar com amigos", "+ felicidade, + bagunca", { happiness: 10, money: -260, stress: 5, relationships: 7 }, 18, { home: "Republica" })
      ]),
      chapter(21, "Inicio adulto", "Bolsa em outra cidade", "Uma bolsa parcial abre uma porta importante, com custo emocional e financeiro.", [
        opt("Ir mesmo assim", "+ estudo, + reputacao", { smarts: 14, education: 15, stress: 8, reputation: 8, money: -420 }, 21),
        opt("Estudar online", "+ equilibrio, - custo", { education: 9, smarts: 7, money: -120 }, 21),
        opt("Adiar um ano", "+ dinheiro, - satisfacao", { money: 520, happiness: -5, stress: 3 }, 21)
      ]),
      chapter(24, "Carreira", "Primeira vaga seria", "Uma empresa abre processo seletivo. O salario ajudaria, mas o ambiente parece duro.", [
        opt("Entrar na empresa", "+ renda, + estresse", { money: 1500, stress: 14, reputation: 9 }, 24, { career: "Analista junior" }),
        opt("Criar projeto local", "+ impacto, + reputacao", { happiness: 12, money: 480, reputation: 13 }, 24, { career: "Lideranca comunitaria" }),
        opt("Prestar concurso", "+ estabilidade futura", { education: 8, stress: 10, money: -180 }, 24, { career: "Concurseira" })
      ]),
      chapter(27, "Vida adulta", "Relacionamento e ambicao", "Alguem importante quer mais presenca sua, enquanto sua carreira pede mais horas.", [
        opt("Priorizar relacionamento", "+ felicidade, + relacoes", { happiness: 12, relationships: 12, stress: -3, money: -120 }, 27),
        opt("Priorizar carreira", "+ dinheiro, - relacoes", { money: 1600, reputation: 8, relationships: -8, stress: 8 }, 27),
        opt("Negociar limites", "+ equilibrio", { happiness: 6, relationships: 5, reputation: 4, stress: -4 }, 27)
      ]),
      chapter(30, "30 anos", "Balanco da primeira fase", "Voce olha para tras e percebe que a vida virou uma mistura de escolhas, sorte e insistencia.", [
        opt("Comprar seu canto", "+ moradia, - dinheiro", { happiness: 10, money: -2600, stress: 6 }, 30, { home: "Apartamento financiado", ending: "Aos 30, voce conquistou uma base concreta sem esquecer de onde veio." }),
        opt("Mudar de carreira", "+ coragem, + estresse", { happiness: 8, education: 6, stress: 10, money: -800 }, 30, { career: "Profissional em transicao", ending: "Aos 30, voce escolheu recomecar com mais consciencia do proprio valor." }),
        opt("Fortalecer sua comunidade", "+ reputacao, + relacoes", { reputation: 16, relationships: 12, happiness: 8 }, 30, { ending: "Aos 30, sua historia virou referencia para quem estava comecando." })
      ])
    ]
  },
  fronteiras: {
    icon: "EF",
    title: "Entre Fronteiras",
    summary: "Cresca entre culturas, aprenda outro idioma e decida quanto da sua origem levar junto.",
    bio: "Voce cresce com curiosidade, saudade herdada e pressa de se adaptar.",
    modifiers: { money: 80, happiness: -2, stress: 8, smarts: 3, relationships: -2 },
    chapters: [
      chapter(0, "Nascimento", "Casa de duas linguas", "Seu nome e pronunciado de jeitos diferentes por cada lado da familia.", [
        opt("Receber dois apelidos", "+ relacoes", { relationships: 7, happiness: 3 }, 1),
        opt("Viver rotina instavel", "+ adaptacao, + estresse", { smarts: 4, stress: 5 }, 1),
        opt("Crescer perto dos avos", "+ familia, + felicidade", { relationships: 8, happiness: 5 }, 1)
      ]),
      chapter(4, "Primeira infancia", "Idioma no parquinho", "Voce entende mais do que consegue responder e observa tudo com atencao.", [
        opt("Misturar idiomas", "+ inteligencia", { smarts: 9, happiness: 3 }, 4),
        opt("Falar pouco", "+ observacao, - relacoes", { smarts: 6, relationships: -2, stress: 3 }, 4),
        opt("Imitar os colegas", "+ adaptacao", { relationships: 5, reputation: 2 }, 4)
      ]),
      chapter(7, "Escola", "Primeiro constrangimento", "Alguem ri do seu sotaque em voz alta.", [
        opt("Responder com humor", "+ reputacao", { reputation: 7, happiness: 4 }, 7),
        opt("Contar para a professora", "+ seguranca", { stress: -4, relationships: 3 }, 7),
        opt("Fingir que nao ligou", "+ estresse", { stress: 8, happiness: -5 }, 7)
      ]),
      chapter(11, "Infancia", "Viagem para rever familia", "A chance de visitar parentes distantes custa caro e mexe com a identidade.", [
        opt("Viajar", "+ raizes, - dinheiro", { happiness: 10, relationships: 10, money: -380 }, 11),
        opt("Guardar dinheiro", "+ economia, - saudade", { money: 300, happiness: -4 }, 11),
        opt("Fazer chamada toda semana", "+ relacoes", { relationships: 7, stress: -2 }, 11)
      ]),
      chapter(15, "Adolescencia", "Dois mundos", "Na escola voce tenta se encaixar; em casa esperam que voce preserve costumes.", [
        opt("Adaptar tudo", "+ reputacao, - felicidade", { reputation: 8, happiness: -5, stress: 4 }, 15),
        opt("Assumir suas origens", "+ felicidade, + coragem", { happiness: 9, reputation: 5, stress: 3 }, 15),
        opt("Circular entre grupos", "+ relacoes, + inteligencia", { relationships: 8, smarts: 5 }, 15)
      ]),
      chapter(17, "Formatura", "Documento, nota e futuro", "Um erro burocratico ameaca atrasar sua inscricao em programas de estudo.", [
        opt("Resolver sozinho", "+ autonomia, + estresse", { smarts: 8, stress: 10, reputation: 3 }, 17),
        opt("Pedir ajuda comunitaria", "+ relacoes", { relationships: 10, stress: -3 }, 17),
        opt("Contratar despachante", "- dinheiro, - estresse", { money: -260, stress: -6 }, 17)
      ]),
      chapter(19, "Maioridade", "Primeiro emprego fora da bolha", "Um emprego cansativo paga agora. Um curso abre portas depois.", [
        opt("Aceitar o trabalho", "+ dinheiro, + estresse", { money: 900, stress: 13 }, 19, { career: "Atendente bilingue" }),
        opt("Fazer curso", "+ estudo, - dinheiro", { education: 15, smarts: 12, money: -360 }, 19),
        opt("Trabalhar meio periodo", "+ equilibrio", { money: 420, education: 7, stress: 5 }, 19)
      ]),
      chapter(22, "Juventude", "Pertencer sem sumir", "Um projeto cultural convida voce para falar sobre sua experiencia.", [
        opt("Aceitar convite", "+ reputacao, + relacoes", { reputation: 12, relationships: 8, happiness: 6 }, 22),
        opt("Recusar exposicao", "- estresse", { stress: -7, happiness: 2 }, 22),
        opt("Levar amigos junto", "+ rede", { relationships: 12, reputation: 5 }, 22)
      ]),
      chapter(25, "Carreira", "Diploma ou negocio", "Voce pode validar estudos, abrir um pequeno negocio ou buscar promocao.", [
        opt("Validar diploma", "+ carreira, - dinheiro", { education: 14, reputation: 8, money: -700 }, 25, { career: "Assistente administrativo" }),
        opt("Abrir negocio cultural", "+ autoria, + risco", { reputation: 12, happiness: 10, money: -900, stress: 9 }, 25, { career: "Empreendedor cultural" }),
        opt("Buscar promocao", "+ renda, + estresse", { money: 1300, reputation: 5, stress: 8 }, 25, { career: "Coordenador de atendimento" })
      ]),
      chapter(28, "Vida adulta", "Chamado de casa", "Uma pessoa querida precisa de apoio em outro lugar.", [
        opt("Viajar para ajudar", "+ relacoes, - dinheiro", { relationships: 14, money: -850, happiness: 5 }, 28),
        opt("Mandar dinheiro", "+ cuidado, - patrimonio", { money: -520, relationships: 7, stress: 3 }, 28),
        opt("Manter rotina", "+ estabilidade, - culpa", { money: 700, happiness: -4, stress: 4 }, 28)
      ]),
      chapter(30, "30 anos", "Mapa proprio", "Voce ja nao cabe em uma unica resposta quando perguntam de onde voce e.", [
        opt("Pedir cidadania", "+ estabilidade", { reputation: 8, stress: -5, money: -500 }, 30, { ending: "Aos 30, voce criou uma vida com duas raizes e uma voz propria." }),
        opt("Voltar por um tempo", "+ familia, + reflexao", { happiness: 10, relationships: 12, money: -900 }, 30, { home: "Entre cidades", ending: "Aos 30, voce entendeu que pertencimento tambem pode ser movimento." }),
        opt("Fundar uma rede", "+ impacto", { reputation: 18, relationships: 10, stress: 4 }, 30, { career: "Articuladora comunitaria", ending: "Aos 30, voce abriu caminho para outras pessoas migrantes." })
      ])
    ]
  },
  nomeProprio: {
    icon: "NP",
    title: "Em Nome Proprio",
    summary: "Construa uma vida mais autentica enquanto encontra rede, trabalho e coragem.",
    bio: "Voce sente cedo que precisa nomear a propria vida com cuidado e firmeza.",
    modifiers: { happiness: -2, stress: 10, smarts: 4, relationships: -3 },
    chapters: [
      chapter(0, "Nascimento", "Um nome escolhido por outros", "Sua familia celebra sua chegada e imagina um futuro que talvez nao combine com voce.", [
        opt("Receber muito colo", "+ relacoes", { relationships: 8, happiness: 4 }, 1),
        opt("Ter uma infancia quieta", "+ observacao", { smarts: 5, stress: 2 }, 1),
        opt("Crescer em casa exigente", "+ disciplina, + estresse", { smarts: 4, stress: 6 }, 1)
      ]),
      chapter(5, "Primeira infancia", "Gostos proprios", "Voce prefere roupas, brincadeiras e jeitos que nem todos entendem.", [
        opt("Insistir no que gosta", "+ felicidade, + estresse", { happiness: 8, stress: 4 }, 5),
        opt("Imitar os outros", "- felicidade, - conflito", { happiness: -5, stress: -2 }, 5),
        opt("Buscar um adulto seguro", "+ relacoes", { relationships: 7, stress: -3 }, 5)
      ]),
      chapter(9, "Escola", "Perguntas por dentro", "Voce percebe que algumas palavras ainda nao existem no seu vocabulario.", [
        opt("Pesquisar escondido", "+ inteligencia", { smarts: 9, stress: 4 }, 9),
        opt("Conversar com amizade", "+ apoio", { relationships: 8, happiness: 5 }, 9),
        opt("Guardar tudo", "+ estresse", { stress: 9, happiness: -6 }, 9)
      ]),
      chapter(13, "Adolescencia", "Uma conversa importante", "Voce considera contar para alguem confiavel o que esta sentindo.", [
        opt("Abrir o jogo", "+ felicidade, + coragem", { happiness: 14, stress: 5, reputation: 4 }, 13),
        opt("Escrever antes de falar", "+ clareza", { smarts: 5, stress: -2, happiness: 4 }, 13),
        opt("Guardar por enquanto", "- felicidade", { happiness: -10, stress: 8 }, 13)
      ]),
      chapter(16, "Ensino medio", "Comentarios no corredor", "Piadas e olhares aparecem. Voce pode se posicionar ou proteger sua energia.", [
        opt("Se posicionar", "+ reputacao, + estresse", { reputation: 12, stress: 8, happiness: 5 }, 16),
        opt("Evitar conflito", "- estresse, - felicidade", { happiness: -5, stress: -3 }, 16),
        opt("Procurar coordencao", "+ seguranca", { stress: -5, reputation: 3, relationships: 3 }, 16)
      ]),
      chapter(18, "Maioridade", "Documentos e independencia", "A vida adulta traz a chance de ajustar escolhas formais e sair de ambientes ruins.", [
        opt("Atualizar documentos", "+ autenticidade, - dinheiro", { happiness: 12, money: -320, stress: -3 }, 18),
        opt("Sair de casa", "+ liberdade, + custo", { happiness: 10, money: -650, stress: 7 }, 18, { home: "Quarto alugado" }),
        opt("Construir reserva", "+ estabilidade", { money: 520, stress: 4 }, 18)
      ]),
      chapter(20, "Rede", "Grupo de apoio", "Um grupo convida voce para uma roda de conversa e mentoria.", [
        opt("Participar", "+ rede, + felicidade", { happiness: 14, relationships: 14, reputation: 5 }, 20),
        opt("Ir uma vez", "+ cautela", { relationships: 5, stress: -2 }, 20),
        opt("Ajudar na organizacao", "+ reputacao, + trabalho", { reputation: 11, relationships: 7, stress: 5 }, 20)
      ]),
      chapter(23, "Estudo e trabalho", "Entrevista delicada", "Uma oportunidade boa aparece, mas voce teme como sera tratada.", [
        opt("Ser transparente", "+ autenticidade, + risco", { happiness: 8, reputation: 6, stress: 6 }, 23, { career: "Assistente de projetos" }),
        opt("Focar no curriculo", "+ carreira", { smarts: 7, education: 8, reputation: 4 }, 23, { career: "Tecnico administrativo" }),
        opt("Recusar ambiente duvidoso", "- dinheiro, + paz", { money: -250, stress: -8, happiness: 5 }, 23)
      ]),
      chapter(26, "Afeto", "Relacionamento serio", "Alguem gosta de voce por inteiro, mas sua rotina ainda carrega antigas defesas.", [
        opt("Viver a relacao", "+ amor, + vulnerabilidade", { happiness: 14, relationships: 12, stress: 3 }, 26),
        opt("Ir devagar", "+ seguranca", { relationships: 5, stress: -4 }, 26),
        opt("Priorizar terapia", "+ saude emocional", { happiness: 8, stress: -12, money: -420 }, 26)
      ]),
      chapter(28, "Autoria", "Convite para falar em publico", "Sua historia pode ajudar alguem, mas exposicao tambem cobra energia.", [
        opt("Aceitar", "+ impacto, + estresse", { reputation: 15, relationships: 8, stress: 7 }, 28, { career: "Mentoria social" }),
        opt("Escrever anonimamente", "+ seguranca, + impacto", { reputation: 7, stress: -2, smarts: 4 }, 28),
        opt("Recusar por agora", "+ descanso", { health: 5, stress: -7 }, 28)
      ]),
      chapter(30, "30 anos", "Nome inteiro", "Voce chega aos 30 com mais palavras, cicatrizes e escolhas suas.", [
        opt("Criar uma ONG", "+ reputacao, + pressao", { reputation: 18, relationships: 12, stress: 8 }, 30, { career: "Diretora de projeto social", ending: "Aos 30, voce transformou sobrevivencia em cuidado coletivo." }),
        opt("Buscar vida tranquila", "+ saude, + paz", { health: 10, stress: -10, happiness: 8 }, 30, { ending: "Aos 30, voce escolheu uma vida menor para os outros e maior para voce." }),
        opt("Mudar de cidade", "+ recomeco", { happiness: 9, money: -900, reputation: 5 }, 30, { home: "Apartamento em outra cidade", ending: "Aos 30, voce levou seu nome para um lugar onde ele respira melhor." })
      ])
    ]
  },
  pesoNome: {
    icon: "PN",
    title: "Peso do Nome",
    summary: "Comece com dinheiro e contatos, mas lide com expectativa, merito e autonomia.",
    bio: "Sua familia oferece acesso, mas tambem define um roteiro quase pronto.",
    modifiers: { money: 1200, happiness: 2, stress: 4, smarts: 8, reputation: 10, education: 8 },
    chapters: [
      chapter(0, "Nascimento", "Sobrenome conhecido", "Antes de andar, voce ja e comparado com pessoas da familia.", [
        opt("Ser mimado", "+ felicidade, - resiliencia", { happiness: 7, stress: -2, smarts: -2 }, 1),
        opt("Ter rotina cheia", "+ disciplina", { smarts: 6, stress: 4 }, 1),
        opt("Crescer cercado", "+ relacoes", { relationships: 6, reputation: 3 }, 1)
      ]),
      chapter(4, "Primeira infancia", "Agenda de adulto", "Musica, idioma, esporte: sua semana tem mais compromisso que a de muita gente.", [
        opt("Aproveitar as aulas", "+ inteligencia", { smarts: 10, education: 6 }, 4),
        opt("Pedir tempo livre", "+ felicidade", { happiness: 8, stress: -5 }, 4),
        opt("Competir em tudo", "+ reputacao, + estresse", { reputation: 6, stress: 6 }, 4)
      ]),
      chapter(8, "Escola", "Colegas e privilegio", "Algumas pessoas se aproximam por interesse; outras desconfiam de voce.", [
        opt("Ser generoso", "+ relacoes, - dinheiro", { relationships: 9, money: -160, reputation: 4 }, 8),
        opt("Ficar no seu grupo", "+ conforto, - mundo", { happiness: 4, smarts: -2 }, 8),
        opt("Provar merito", "+ estudo, + pressao", { smarts: 8, stress: 6 }, 8)
      ]),
      chapter(12, "Infancia", "Primeira grande cobranca", "Sua familia espera nota alta e postura impecavel.", [
        opt("Obedecer roteiro", "+ reputacao, - felicidade", { reputation: 8, happiness: -5, education: 5 }, 12),
        opt("Questionar expectativas", "+ autonomia, + conflito", { happiness: 5, stress: 7 }, 12),
        opt("Negociar metas", "+ equilibrio", { education: 5, relationships: 4, stress: -2 }, 12)
      ]),
      chapter(16, "Adolescencia", "Caminho tradicional", "Todos supoem que voce seguira uma carreira segura dentro da rede da familia.", [
        opt("Seguir tradicao", "+ dinheiro, - liberdade", { money: 900, happiness: -4, reputation: 8 }, 16),
        opt("Buscar caminho proprio", "+ autoria, + estresse", { smarts: 12, stress: 10 }, 16),
        opt("Fazer intercambio", "+ mundo, - dinheiro", { smarts: 10, education: 8, money: -900 }, 16)
      ]),
      chapter(18, "Maioridade", "Heranca antecipada", "Sua familia oferece ajuda, mas quer opinar nas suas decisoes.", [
        opt("Aceitar ajuda", "+ dinheiro, + controle", { money: 2200, stress: 6 }, 18),
        opt("Recusar ajuda", "+ orgulho, - conforto", { happiness: 7, money: -500, stress: 5 }, 18),
        opt("Aceitar com limites", "+ estabilidade", { money: 1100, relationships: 3, stress: -1 }, 18)
      ]),
      chapter(21, "Universidade", "Nome na porta", "Um professor conhece sua familia e isso muda o jeito como avaliam voce.", [
        opt("Usar conexao", "+ oportunidade, + duvida", { reputation: 9, money: 400, stress: 5 }, 21),
        opt("Evitar favoritismo", "+ respeito proprio", { smarts: 9, reputation: 3, stress: 7 }, 21),
        opt("Transformar em mentoria", "+ aprendizado", { education: 12, relationships: 5 }, 21)
      ]),
      chapter(24, "Carreira", "Primeira vaga grande", "Uma indicacao familiar pode abrir uma porta que muita gente nem ve.", [
        opt("Aceitar indicacao", "+ renda, + suspeita", { money: 2200, reputation: 8, stress: 8 }, 24, { career: "Consultor junior" }),
        opt("Concorrer sozinho", "+ merito, + pressao", { smarts: 10, stress: 12, reputation: 5 }, 24, { career: "Analista independente" }),
        opt("Criar startup", "+ risco, + autonomia", { money: -1600, reputation: 12, happiness: 10, stress: 10 }, 24, { career: "Fundador iniciante" })
      ]),
      chapter(26, "Imagem publica", "Erro nas redes", "Uma postagem antiga vira assunto e muita gente espera sua resposta.", [
        opt("Pedir desculpas", "+ maturidade", { reputation: 6, stress: 4 }, 26),
        opt("Apagar e sumir", "- reputacao, - estresse", { reputation: -8, stress: -2 }, 26),
        opt("Conversar publicamente", "+ respeito, + pressao", { reputation: 10, relationships: 4, stress: 8 }, 26)
      ]),
      chapter(28, "Familia", "Convite para assumir negocio", "Seu sobrenome pode virar cargo, mas talvez voce perca liberdade.", [
        opt("Assumir negocio", "+ patrimonio, + cobranca", { money: 3200, reputation: 10, stress: 12 }, 28, { career: "Diretora de operacoes" }),
        opt("Ficar independente", "+ autoria", { happiness: 9, reputation: 5, money: 700 }, 28),
        opt("Entrar com contrato claro", "+ equilibrio", { money: 1800, stress: 3, relationships: 5 }, 28, { career: "Socio executivo" })
      ]),
      chapter(30, "30 anos", "Merito e nome", "Voce chega aos 30 tentando separar conforto, culpa e desejo real.", [
        opt("Usar poder para abrir portas", "+ impacto", { reputation: 18, relationships: 8, money: -1200 }, 30, { ending: "Aos 30, voce decidiu transformar privilegio em responsabilidade concreta." }),
        opt("Vender sua parte", "+ liberdade, + dinheiro", { money: 5000, happiness: 10, stress: -5 }, 30, { career: "Investidora independente", ending: "Aos 30, voce comprou liberdade com uma decisao dificil." }),
        opt("Continuar legado", "+ patrimonio, + pressao", { money: 4200, reputation: 12, stress: 9 }, 30, { ending: "Aos 30, voce aceitou o peso do nome, mas agora segurando a caneta." })
      ])
    ]
  }
};

const activities = [
  { title: "Academia", text: "Melhora saude e reduz estresse.", icon: "SA", effect: { health: 8, stress: -6, happiness: 2, money: -35 } },
  { title: "Biblioteca", text: "Aumenta inteligencia com pouco custo.", icon: "IN", effect: { smarts: 7, happiness: 1, education: 2 } },
  { title: "Sair com amigos", text: "Aumenta felicidade e relacoes, mas gasta dinheiro.", icon: "AM", effect: { happiness: 9, relationships: 6, stress: -4, money: -60 } },
  { title: "Terapia", text: "Custa caro, mas ajuda a estabilizar a vida.", icon: "TE", effect: { stress: -12, happiness: 5, money: -120 } },
  { title: "Voluntariado", text: "Cria rede e melhora reputacao.", icon: "VO", effect: { relationships: 7, reputation: 6, happiness: 3, stress: 2 } },
  { title: "Namorar", text: "Tenta fortalecer a vida afetiva.", icon: "CO", special: "date" }
];

const careerActions = [
  { title: "Freelance", text: "Ganhe dinheiro agora, com um pouco de estresse.", icon: "FR", effect: { money: 220, stress: 5 } },
  { title: "Curso profissional", text: "Invista em qualificacao para subir na carreira.", icon: "CP", effect: { smarts: 8, education: 7, money: -180, reputation: 4 } },
  { title: "Pedir promocao", text: "Funciona melhor com inteligencia e reputacao altas.", icon: "PR", special: "promotion" },
  { title: "Networking", text: "Conheca pessoas que podem abrir oportunidades.", icon: "NW", effect: { relationships: 7, reputation: 4, stress: 3, money: -80 } }
];

const defaultState = {
  age: 0,
  money: 0,
  happiness: 50,
  health: 100,
  smarts: 50,
  stress: 10,
  reputation: 0,
  relationships: 45,
  education: 0,
  chapterIndex: null,
  storyKey: null,
  career: "Nenhum",
  home: "Casa da familia",
  ended: false,
  log: []
};

let state = loadState();

const $ = (selector) => document.querySelector(selector);
const elements = {
  avatar: $("#avatar"),
  lifeStage: $("#lifeStage"),
  characterName: $("#characterName"),
  characterBio: $("#characterBio"),
  ageValue: $("#ageValue"),
  moneyValue: $("#moneyValue"),
  bankValue: $("#bankValue"),
  happinessValue: $("#happinessValue"),
  healthValue: $("#healthValue"),
  smartsValue: $("#smartsValue"),
  stressValue: $("#stressValue"),
  relationshipsValue: $("#relationshipsValue"),
  happinessBar: $("#happinessBar"),
  healthBar: $("#healthBar"),
  smartsBar: $("#smartsBar"),
  stressBar: $("#stressBar"),
  relationshipsBar: $("#relationshipsBar"),
  storyGrid: $("#storyGrid"),
  choiceCard: $("#choiceCard"),
  choiceChapter: $("#choiceChapter"),
  choiceTitle: $("#choiceTitle"),
  choiceText: $("#choiceText"),
  choiceActions: $("#choiceActions"),
  timeline: $("#timeline"),
  activityActions: $("#activityActions"),
  careerActions: $("#careerActions"),
  careerTitle: $("#careerTitle"),
  careerText: $("#careerText"),
  homeValue: $("#homeValue"),
  reputationValue: $("#reputationValue"),
  educationValue: $("#educationValue"),
  toast: $("#toast")
};

function chapter(ageTo, stage, title, text, options) {
  return { ageTo, stage, title, text, options };
}

function opt(label, detail, effect, ageTo, extra = {}) {
  return { label, detail, effect, ageTo, ...extra };
}

function loadState() {
  try {
    const saved = localStorage.getItem("lifesim-state");
    const parsed = saved ? JSON.parse(saved) : null;
    if (!parsed) return createNewState();
    return normalizeState({ ...defaultState, ...parsed });
  } catch {
    return createNewState();
  }
}

function normalizeState(source) {
  const normalized = { ...defaultState, ...source };
  if (normalized.chapterIndex === null && normalized.chapter) normalized.chapterIndex = 0;
  normalized.relationships = clamp(normalized.relationships ?? 45);
  normalized.education = clamp(normalized.education ?? 0);
  normalized.reputation = clamp(normalized.reputation ?? 0, -20, 100);
  normalized.log = Array.isArray(normalized.log) ? normalized.log : [];
  return normalized;
}

function createNewState() {
  return {
    ...defaultState,
    name: names[Math.floor(Math.random() * names.length)],
    log: ["Voce nasceu. O mundo ainda nao sabe o que vem por ai."]
  };
}

function saveState(showMessage = false) {
  localStorage.setItem("lifesim-state", JSON.stringify(state));
  if (showMessage) showToast("Vida salva.");
}

function resetLife() {
  state = createNewState();
  saveState();
  render();
  showToast("Nova vida criada.");
}

function startStory(storyKey) {
  const story = stories[storyKey];
  const base = { ...createNewState(), name: state.name || names[Math.floor(Math.random() * names.length)] };
  const withOrigin = applyRawEffect(base, story.modifiers);
  state = normalizeState({
    ...withOrigin,
    storyKey,
    chapterIndex: 0,
    ended: false,
    career: "Nenhum",
    home: "Casa da familia",
    log: [`${withOrigin.name} comecou: ${story.title}.`, "Voce nasceu. O mundo ainda nao sabe o que vem por ai."]
  });
  saveState();
  render();
}

function applyRawEffect(current, effect = {}) {
  return {
    ...current,
    money: Math.max(0, current.money + (effect.money || 0)),
    happiness: clamp(current.happiness + (effect.happiness || 0)),
    health: clamp(current.health + (effect.health || 0)),
    smarts: clamp(current.smarts + (effect.smarts || 0)),
    stress: clamp(current.stress + (effect.stress || 0)),
    reputation: clamp(current.reputation + (effect.reputation || 0), -20, 100),
    relationships: clamp((current.relationships ?? 45) + (effect.relationships || 0)),
    education: clamp((current.education ?? 0) + (effect.education || 0))
  };
}

function chooseOption(option) {
  const chapter = getCurrentChapter();
  state = applyRawEffect(state, option.effect);
  state.age = Math.max(state.age + 1, option.ageTo ?? chapter?.ageTo ?? state.age + 1);

  if (option.career) state.career = option.career;
  if (option.home) state.home = option.home;

  state.log = [
    `<b>${state.age} anos:</b> ${option.label}. ${effectSummary(option.effect)}`,
    ...state.log
  ];

  if (option.ending) {
    state.ended = true;
    state.chapterIndex = null;
    state.log = [`<b>Final aos 30:</b> ${option.ending}`, ...state.log];
  } else {
    state.chapterIndex += 1;
    addBetweenYearsEvent();
  }

  saveState();
  render();
}

function ageUp() {
  if (!state.storyKey) {
    showToast("Escolha uma historia para comecar.");
    return;
  }

  if (!state.ended && getCurrentChapter()) {
    showToast("Escolha uma opcao para continuar sua historia.");
    return;
  }

  state.age += 1;
  randomYearEvent();
  saveState();
  render();
}

function addBetweenYearsEvent() {
  if (state.ended || Math.random() < 0.25) return;
  randomYearEvent(true);
}

function randomYearEvent(isSideEvent = false) {
  const pool = state.age < 13 ? lifeEvents.child : state.age < 20 ? lifeEvents.teen : lifeEvents.adult;
  const passive = {
    health: -Math.floor(Math.random() * 3),
    stress: Math.floor(Math.random() * 4),
    happiness: Math.floor(Math.random() * 5) - 2
  };
  const event = pool[Math.floor(Math.random() * pool.length)];
  state = applyRawEffect(state, passive);
  state = applyRawEffect(state, event.effect);
  const label = isSideEvent ? "Enquanto isso" : `${state.age} anos`;
  state.log = [`<b>${label}:</b> ${event.text} ${effectSummary({ ...passive, ...event.effect })}`, ...state.log];
}

function runAction(action) {
  if (!state.storyKey) {
    showToast("Comece uma historia antes de agir.");
    return;
  }

  if (action.special === "promotion") {
    const chance = state.smarts + state.reputation + state.education - state.stress;
    const success = chance > 72 || Math.random() * 100 < chance;
    const effect = success ? { money: 650, reputation: 8, happiness: 5 } : { stress: 8, happiness: -4 };
    state = applyRawEffect(state, effect);
    state.log = [
      `<b>${state.age} anos:</b> ${success ? "A promocao veio." : "A promocao nao veio desta vez."} ${effectSummary(effect)}`,
      ...state.log
    ];
  } else if (action.special === "date") {
    const success = Math.random() * 100 < state.happiness + state.relationships - state.stress / 2;
    const effect = success ? { happiness: 9, relationships: 9, stress: -2, money: -90 } : { happiness: -3, stress: 4, money: -50 };
    state = applyRawEffect(state, effect);
    state.log = [
      `<b>${state.age} anos:</b> ${success ? "O encontro rendeu uma conexao boa." : "O encontro foi estranho, mas virou historia."} ${effectSummary(effect)}`,
      ...state.log
    ];
  } else {
    state = applyRawEffect(state, action.effect);
    state.log = [`<b>${state.age} anos:</b> ${action.title}. ${effectSummary(action.effect)}`, ...state.log];
  }
  saveState();
  render();
}

function getCurrentChapter() {
  const story = stories[state.storyKey];
  if (!story || state.chapterIndex === null) return null;
  return story.chapters[state.chapterIndex] || null;
}

function effectSummary(effect = {}) {
  const labels = {
    money: "dinheiro",
    happiness: "felicidade",
    health: "saude",
    smarts: "inteligencia",
    stress: "estresse",
    reputation: "reputacao",
    relationships: "relacoes",
    education: "estudo"
  };

  const summary = Object.entries(effect)
    .filter(([, value]) => value)
    .map(([key, value]) => `${value > 0 ? "+" : ""}${value} ${labels[key]}`)
    .join(", ");

  return summary || "sem mudancas nos atributos.";
}

function render() {
  renderIdentity();
  renderStats();
  renderStories();
  renderChoice();
  renderActions();
  renderTimeline();
}

function renderIdentity() {
  const story = stories[state.storyKey];
  elements.avatar.textContent = state.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  elements.lifeStage.textContent = story ? story.title : "Nova vida";
  elements.characterName.textContent = state.name;
  elements.characterBio.textContent = story ? story.bio : "Escolha uma origem para iniciar a simulacao.";
}

function renderStats() {
  elements.ageValue.textContent = state.age;
  elements.moneyValue.textContent = formatMoney(state.money);
  elements.bankValue.textContent = formatMoney(state.money);
  elements.happinessValue.textContent = `${state.happiness}%`;
  elements.healthValue.textContent = `${state.health}%`;
  elements.smartsValue.textContent = `${state.smarts}%`;
  elements.stressValue.textContent = `${state.stress}%`;
  elements.relationshipsValue.textContent = `${state.relationships}%`;
  elements.happinessBar.style.width = `${state.happiness}%`;
  elements.healthBar.style.width = `${state.health}%`;
  elements.smartsBar.style.width = `${state.smarts}%`;
  elements.stressBar.style.width = `${state.stress}%`;
  elements.relationshipsBar.style.width = `${state.relationships}%`;
  elements.careerTitle.textContent = state.career;
  elements.homeValue.textContent = state.home;
  elements.reputationValue.textContent = reputationLabel();
  elements.educationValue.textContent = educationLabel();
}

function renderStories() {
  elements.storyGrid.innerHTML = "";
  elements.storyGrid.classList.toggle("hidden", Boolean(state.storyKey));

  Object.entries(stories).forEach(([key, story]) => {
    const button = document.createElement("button");
    button.className = "story-button";
    button.type = "button";
    button.innerHTML = buttonMarkup(story.icon, story.title, story.summary);
    button.addEventListener("click", () => startStory(key));
    elements.storyGrid.appendChild(button);
  });
}

function renderChoice() {
  const chapter = getCurrentChapter();
  elements.choiceCard.classList.toggle("hidden", !chapter);

  if (!chapter) return;

  elements.choiceChapter.textContent = chapter.ageTo === 0
    ? chapter.stage
    : `${chapter.stage} - ate ${chapter.ageTo} anos`;
  elements.choiceTitle.textContent = chapter.title;
  elements.choiceText.textContent = chapter.text;
  elements.choiceActions.innerHTML = "";

  chapter.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.innerHTML = `<span><span class="button-title">${option.label}</span><span class="button-text">${option.detail}</span></span>`;
    button.addEventListener("click", () => chooseOption(option));
    elements.choiceActions.appendChild(button);
  });
}

function renderActions() {
  renderActionList(elements.activityActions, activities);
  renderActionList(elements.careerActions, careerActions);
  elements.careerText.textContent = state.career === "Nenhum"
    ? "Cresca, estude e aceite oportunidades para abrir carreiras melhores."
    : "Continue melhorando seus atributos para conquistar mais dinheiro e reputacao.";
}

function renderActionList(container, actions) {
  container.innerHTML = "";
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-button";
    button.type = "button";
    button.innerHTML = buttonMarkup(action.icon, action.title, action.text);
    button.addEventListener("click", () => runAction(action));
    container.appendChild(button);
  });
}

function buttonMarkup(icon, title, text) {
  return `<span class="button-icon">${icon}</span><span><span class="button-title">${title}</span><span class="button-text">${text}</span></span>`;
}

function renderTimeline() {
  elements.timeline.innerHTML = "";
  state.log.slice(0, 24).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    elements.timeline.appendChild(li);
  });
}

function reputationLabel() {
  if (state.reputation >= 55) return "Excelente";
  if (state.reputation >= 25) return "Boa";
  if (state.reputation >= 5) return "Neutra";
  if (state.reputation >= -5) return "Baixa";
  return "Fragil";
}

function educationLabel() {
  if (state.education >= 80) return "Superior forte";
  if (state.education >= 55) return "Superior";
  if (state.education >= 30) return "Tecnico/medio";
  if (state.education >= 10) return "Basico";
  return "Inicial";
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.add("hidden"), 1800);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
  });
});

$("#ageButton").addEventListener("click", ageUp);
$("#newLifeButton").addEventListener("click", resetLife);
$("#saveButton").addEventListener("click", () => saveState(true));

render();
