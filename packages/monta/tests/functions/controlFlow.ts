import Monta from '../../src';

test('eq', async () => {
	const render = await new Monta().compile('<p>${ eq(foo, "bar"): }yes${ :end }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p>yes</p>');
	expect(await render({ foo: 'foo' })).toBe('<p></p>');
});

test('eq (pipe)', async () => {
	const render = await new Monta().compile('<p>${ foo | eq("bar"): }yes${ :end }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p>yes</p>');
	expect(await render({ foo: 'foo' })).toBe('<p></p>');
});

test('eq (else)', async () => {
	const render = await new Monta().compile('<p>${ foo | eq("bar"): }yes${ :else: }no${ :end }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p>yes</p>');
	expect(await render({ foo: 'foo' })).toBe('<p>no</p>');
});

test('neq', async () => {
	const render = await new Monta().compile('<p>${ neq(foo, "bar"): }yes${ :end }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p></p>');
	expect(await render({ foo: 'foo' })).toBe('<p>yes</p>');
});

test('neq (pipe)', async () => {
	const render = await new Monta().compile('<p>${ foo | neq("bar"): }yes${ :end }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p></p>');
	expect(await render({ foo: 'foo' })).toBe('<p>yes</p>');
});

test('neq (else)', async () => {
	const render = await new Monta().compile('<p>${ foo | neq("bar"): }yes${ :else: }no${ :end }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p>no</p>');
	expect(await render({ foo: 'foo' })).toBe('<p>yes</p>');
});

test('lt', async () => {
	const render = await new Monta().compile('<p>${ lt(num, 2): }yes${ :end }</p>');

	expect(await render({ num: 1 })).toBe('<p>yes</p>');
	expect(await render({ num: 10 })).toBe('<p></p>');
});

test('lt (pipe)', async () => {
	const render = await new Monta().compile('<p>${ num | lt(2): }yes${ :end }</p>');

	expect(await render({ num: 1 })).toBe('<p>yes</p>');
	expect(await render({ num: 10 })).toBe('<p></p>');
});

test('lt (else)', async () => {
	const render = await new Monta().compile('<p>${ num | lt(2): }yes${ :else: }no${ :end }</p>');

	expect(await render({ num: 1 })).toBe('<p>yes</p>');
	expect(await render({ num: 10 })).toBe('<p>no</p>');
});

test('gt', async () => {
	const render = await new Monta().compile('<p>${ gt(num, 2): }yes${ :end }</p>');

	expect(await render({ num: 1 })).toBe('<p></p>');
	expect(await render({ num: 10 })).toBe('<p>yes</p>');
});

test('gt (pipe)', async () => {
	const render = await new Monta().compile('<p>${ num | gt(2): }yes${ :end }</p>');

	expect(await render({ num: 1 })).toBe('<p></p>');
	expect(await render({ num: 10 })).toBe('<p>yes</p>');
});

test('gt (else)', async () => {
	const render = await new Monta().compile('<p>${ num | gt(2): }yes${ :else: }no${ :end }</p>');

	expect(await render({ num: 1 })).toBe('<p>no</p>');
	expect(await render({ num: 10 })).toBe('<p>yes</p>');
});

test('array has', async () => {
	const render = await new Monta().compile('<p>${ has(arr, 2): }yes${ :end }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>yes</p>');
	expect(await render({ arr: [4, 5, 6] })).toBe('<p></p>');
});

test('array has (pipe)', async () => {
	const render = await new Monta().compile('<p>${ arr | has(2): }yes${ :end }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>yes</p>');
	expect(await render({ arr: [4, 5, 6] })).toBe('<p></p>');
});

test('array has (else)', async () => {
	const render = await new Monta().compile('<p>${ arr | has(2): }yes${ :else: }no${ :end }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>yes</p>');
	expect(await render({ arr: [4, 5, 6] })).toBe('<p>no</p>');
});

test('object has', async () => {
	const render = await new Monta().compile('<p>${ has(obj, "foo"): }yes${ :end }</p>');

	expect(await render({ obj: { foo: 'foo' } })).toBe('<p>yes</p>');
	expect(await render({ obj: { bar: 'bar' } })).toBe('<p></p>');
});

test('object has (pipe)', async () => {
	const render = await new Monta().compile('<p>${ obj | has("foo"): }yes${ :end }</p>');

	expect(await render({ obj: { foo: 'foo' } })).toBe('<p>yes</p>');
	expect(await render({ obj: { bar: 'bar' } })).toBe('<p></p>');
});

test('object has (else)', async () => {
	const render = await new Monta().compile('<p>${ obj | has("foo"): }yes${ :else: }no${ :end }</p>');

	expect(await render({ obj: { foo: 'foo' } })).toBe('<p>yes</p>');
	expect(await render({ obj: { bar: 'bar' } })).toBe('<p>no</p>');
});
