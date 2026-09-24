import { useEffect, useState } from 'react'

const URL = 'https://jsonplaceholder.typicode.com/posts'

export default function App() {
const [avisos, setAvisos] = useState([])
const [carregando, setCarregando] = useState(true)
const [erro, setErro] = useState(null)
const [editId, setEditId] = useState(null)
const [titulo, setTitulo] = useState('')
const [texto, setTexto] = useState('')

useEffect(() => {
const c = new AbortController()
async function buscar() {
try {
const r = await fetch(`${URL}?_limit=15`, { signal: c.signal })
if (!r.ok) throw new Error(`HTTP ${r.status}`)
setAvisos(await r.json())
} catch (e) {
if (e.name !== 'AbortError') setErro(e.message)
} finally {
setCarregando(false)
}}
buscar()
return () => c.abort()}, [])

async function enviar(e) {
e.preventDefault()
if (!titulo.trim() || !texto.trim()) return setErro('texto e titulo')

try {
const metodo = editId ? 'PUT' : 'POST'
const rota = editId ? `${URL}/${editId}` : URL
const r = await fetch(rota, {
method: metodo,
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userId: 1, id: editId, title: titulo, body: texto }),})

if (!r.ok) throw new Error(`HTTP ${r.status}`)
const dados = await r.json()

if (editId) setAvisos(avisos.map(a => a.id === editId ? dados : a))
else setAvisos([dados, ...avisos])

setEditId(null); setTitulo(''); setTexto(''); setErro(null)
} catch (e) {
setErro(e.message)}}

function editar(a) {
setEditId(a.id); setTitulo(a.title); setTexto(a.body)}

async function excluir(id) {
const anterior = avisos
setAvisos(avisos.filter(a => a.id !== id))
try {
const r = await fetch(`${URL}/${id}`, { method: 'DELETE' })
if (!r.ok) throw new Error(`HTTP ${r.status}`)
} catch (e) {
setAvisos(anterior); setErro(e.message)}}

return (
<div className="container">
<h1>Mural de Avisos</h1>

<form onSubmit={enviar}>
<input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="titulo" />
<textarea value={texto} onChange={e => setTexto(e.target.value)} placeholder="aviso de texto" />
<button type="submit">{editId ? 'salva' : 'publica aviso'}</button>
{editId && <button type="button" onClick={() => editar({ id: null, title: '', body: '' })}>cancelar</button>}</form>

{erro && <p className="erro">{erro}</p>}
{carregando && <p>Carregando avisos...</p>}
{!carregando && avisos.length === 0 && <p>Nenhum aviso publicado.</p>}

{avisos.map(a => (
<div key={a.id} className="cartao">
<h3>{a.title}</h3>
<p>{a.body}</p>
<small>post id {a.id} · usuário {a.userId}</small><div>
<button onClick={() => editar(a)}>Editar</button>
<button onClick={() => excluir(a.id)}>Excluir</button>
</div></div>
))}
</div>)}