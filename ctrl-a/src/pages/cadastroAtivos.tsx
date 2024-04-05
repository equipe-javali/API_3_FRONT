import './css/cadastroAtivos.css'
import { useState } from "react"

export default function CadastroAtivos() {
    const [tipoAtivo, setTipoAtivo] = useState(0)
    const [proximo, setProximo] = useState(1)
    const [pagina, setPagina] = useState(1)
    return (
        <>
            <div>
                <div>
                    <h1> Cadastrar {tipoAtivo === 1 ? <>Ativo Tangível</> : tipoAtivo === 2 ? <> Ativo Intangível</> : <> Ativo</>}</h1>
                </div>
                <form>
                    {tipoAtivo === 1 ? <>
                        {pagina === 1 && <>
                            <div>
                                <button
                                    onClick={() => setTipoAtivo(0)}
                                >
                                    <span>◀</span> Voltar
                                </button>
                                <button
                                    onClick={() => setPagina(2)}
                                >
                                    Proximo <span>▶</span>
                                </button>
                            </div>
                        </>}
                        {pagina === 2 && <>
                            <div>
                                <button
                                    onClick={() => setPagina(1)}

                                >
                                    <span>◀</span> Voltar
                                </button>
                            </div>
                        </>}
                    </> : tipoAtivo === 2 ? <>
                        <div>
                            <button
                                onClick={() => setTipoAtivo(0)}
                            >
                                <span>◀</span> Voltar
                            </button>
                        </div>
                    </> : <>
                        <div>
                            <input
                                type="radio"
                                checked={proximo === 1}
                                onClick={() => setProximo(1)}
                            />
                            <label> Tangível</label>
                            <input
                                type="radio"
                                checked={proximo === 2}
                                onClick={() => setProximo(2)}
                            />
                            <label> InTangível</label>
                        </div>
                        <div>
                            <button
                                onClick={() => setTipoAtivo(proximo)}
                            >
                                Proximo <span>▶</span>
                            </button>
                        </div>
                    </>}
                </form>
            </div>
        </>
    )
}