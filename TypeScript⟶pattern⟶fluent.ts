// FLUENTE: ADICIONANDO NOVOS MÉTODOS A INSTANCIA 
// Este código demonstra um pattern fluente em que cada chamada de addMethod    |
// estende o tipo da instância retornada. O método addMethod recebe um nome e   |
// uma função e retorna o próprio objeto com uma tipagem que agora inclui esse  |
// novo método. A cada encadeamento, o TypeScript passa a reconhecer mais       |
// propriedades disponíveis. A função passada para addMethod recebe como        |
// parâmetro a própria instância já tipada até aquele ponto, permitindo acessar |
// apenas os métodos previamente adicionados. Métodos inexistentes continuam    |
// indisponíveis. Neste exemplo, o JavaScript não adiciona métodos de fato, mas |
// o TypeScript trata esses métodos como adicionados dinamicamente no nível de  |
// tipagem.                                                                     |

type Fn<T> = (ctx: T) => any 

class Base {
	addMethod<K extends string>(
		name: K,
		fn: Fn<this>
	): this & Record<K, Fn<this>> {
		return this as any
	}
}

const r	 = new Base() //   ↓ não existe
	.addMethod("dunha", ({ nonexistentMethod, addMethod }) => null)
	.addMethod("coala", ({ nonexistentMethod, addMethod, dunha }) => null)
	.addMethod("maria", ({ nonexistentMethod, addMethod, coala, dunha }) => null)

r.addMethod
r.coala
r.dunha
r.maria
r.nonexistentMethod // ← não existe

// FLUENTE: ADICIONANDO NOVOS MÉTODOS A UM 
// OBJETO QUE É PROPRIEDADE DA INSTANCIA CRIADA
// Este código aplica o mesmo pattern fluente de extensão gradual de tipos, mas |
// agora os métodos não são adicionados diretamente à instância principal. O    |
// método addPropertToInnerObject retorna uma nova versão tipada de Base, onde o|
// tipo genérico T é estendido para incluir novas propriedades dentro de        |
// innerObject. A cada chamada encadeada, o TypeScript passa a reconhecer mais  |
// métodos apenas dentro de innerObject. A função recebida por                  |
// addPropertToInnerObject recebe como contexto o tipo atual de innerObject,    |
// permitindo acessar somente as propriedades já adicionadas até aquele ponto.  |
// Assim como antes, isso acontece no nível de tipagem, não como modificação    |
// real em tempo de execução.                                                   |
//                                                                              |
// ** Diferença em relação ao exemplo anterior **                               |
// No exemplo anterior, os métodos passam a existir diretamente na instância    |
// fluente; neste, os métodos são acumulados em um objeto filho (innerObject),  |
// mantendo a API principal estável e concentrando a extensão de tipos em uma   |
// propriedade específica.                                                      |

type Fn<T> = (ctx: T) => any 

class Base<T extends {}> {
	innerObject: T

	addPropertToInnerObject<K extends string>(
		name: K,
		fn: Fn<T>
	): Base<T & Record<K, Fn<T>>> {
		return this as any
	}
}

const r = new Base() //                  ↓ não existe       ↓ inacessível
	.addPropertToInnerObject("dunha", ({ nonexistentMethod, addPropertToInnerObject }) => null)
	.addPropertToInnerObject("coala", ({ nonexistentMethod, addPropertToInnerObject, dunha }) => null)
	.addPropertToInnerObject("maria", ({ nonexistentMethod, addPropertToInnerObject, coala, dunha }) => null)

r.innerObject.coala
r.innerObject.dunha
r.innerObject.maria
r.innerObject.nonexistentMethod // ← não existe
