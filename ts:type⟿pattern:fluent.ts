type Fn<T> = (ctx: T) => any 

class Base {
	addMethod<K extends string>(
		name: K,
		fn: Fn<this>
	): this & Record<K, Fn<this>> {
		return this as any
	}
}

const r = new Base()  // ↓ não existe
	.addMethod("dunha", ({ nonExistententMethod, addMethod }) => null)
	.addMethod("coala", ({ nonExistententMethod, addMethod, dunha }) => null)
	.addMethod("maria", ({ nonExistententMethod, addMethod, coala, dunha }) => null)

r.addMethod
r.coala
r.dunha
r.maria
r.nonExistententMethod // ← não existe
