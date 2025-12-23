type BaseMais<T, Opts extends {}> = T & {
	// [K in string]                         | K é string
	// : K extends keyof T                   | K é uma chave em T?
	//   ? T[K]                              | - se sim: K tem o mesmo tipo da chave de mesmo nome existente em T
	//   : ((opts: Opts) => any) | undefined | - se não: K é do tipo `(opts: Opts) => any` ou `indefinido`
	[K in string]: K extends keyof T ? T[K] : ((opts: Opts) => any) | undefined
}

const canInstantiateWithNew = Symbol()

class Base {
	static [canInstantiateWithNew] = false

	private constructor() {
		if (!this.constructor[canInstantiateWithNew])
			throw "instancie a classe com o método estático create"
	}

	static create<Opts extends {}>() {
		this[canInstantiateWithNew] = true
		const obj = new this
		this[canInstantiateWithNew] = false
		return obj as BaseMais<Base, Opts> // <--- a mágica do casting
	}

	check(): true { 
		return true 
	}
}

// Cria uma instância de Base (com o método retornando o tipo já com o casting correto)
const b = Base.create<{ max?: number }>()

// Deve funcionar de boas, aqui `minhaRegra`, deixa de ser possivelmente `undefined`
b.minhaRegra = ({ max }) => null!
b.minhaRegra({ max: 100 })

// Por contas do `| undefined´ na definição do tipo BaseMais, regraInexistente pode ser
// `((opts: Opts) => any) | undefined` e como em nenhum momento foi explicitamente dito 
// que não é `undefined`, temos o erro de tipo: 
// - `Cannot invoke an object which is possibly 'undefined'.` 
b.regraInexistente() 

// Erro de tipo, pq check foi definido na classe e portanto é do tipo () => true:
// - Type 'false' is not assignable to type 'true'.
b.check = () => false
