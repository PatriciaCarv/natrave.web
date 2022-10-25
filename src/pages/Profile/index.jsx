import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, formatISO } from 'date-fns'
import { useLocalStorage, useAsyncFn } from 'react-use'
import axios from 'axios'

import { Icon, Card, DateSelect } from '~/components'


export const Profile = () => {
    const [auth, setAuth] = useLocalStorage('auth', {})
    // const params = useParams()
    const navigate = useNavigate ()

    const [currentDate, setDate] = useState(formatISO(new Date(2022, 10, 20)))
    

    const [hunches, fetchHunches] = useAsyncFn(async () => {
        const res = await axios ({
            method: 'get',
            baseURL: import.meta.env.VITE_API_URL,
            url: `/hunches/${auth.user.username}`,
            
        })

        const hunchesMap = res.data.reduce((acc, hunch) => {
            acc[hunch.gameId] = hunch
            return acc
        }, {})

        return hunchesMap
    }) 
    
    const [games, fetchGames] = useAsyncFn(async (params) => {
        const res = await axios ({
        method: 'get',
        baseURL: import.meta.env.VITE_API_URL,
        url: '/games',
        params
    })

    return res.data
})

const logout = () => {
    setAuth({})
    navigate('/login')
}

const isLoading = games.loading || hunches.loading
const hasError = games.error || hunches.error
const isDone = !isLoading && !hasError

useEffect (() => {
    fetchGames({gameTime: currentDate})
    fetchHunches()
}, [currentDate])

return (
    <>
        <header className="bg-red-500 text-white">
            <div className="container max-w-3xl flex justify-between p-4">
                <img src="/imgs/logo-fundo-vermelho.svg" className="w-28 md:w-40"/>
                {auth?.user?.id && (          
                    <div onClick={logout} className="p-2 cursor-pointer">
                        Sair
                    </div>
                )}
            </div>
        </header>


            <main className="space-y-6">
                <section id="header" className="bg-red-500 text-white">
                    <div className=" container max-w-3xl space-y-2 p-4">
                        <a href="/dashboard">
                            <Icon name="back" className="w-10"/>
                        </a>
                        <h3 className="text-2xl font-bold">{ auth.user.name }</h3>
                    </div>
                </section>

                <section id="content" className="container max-w-3xl p-4 space-y-4">
                    <h2 className="text-red-500 text-xl font-bold">Seus palpites</h2>

                    <DateSelect currentDate={currentDate} onChange={setDate}/>

                    <div className="space-y-4">
                        {isLoading && 'Carregando jogos...'}
                        {hasError && 'Ops! Algo deu errado'}

                        {isDone && games.value?.map(game => {
                            let home = '';
                            let away = '';
                            home = hunches?.value?.[game.id]?.homeTeamScore.toString()
                            away = hunches?.value?.[game.id]?.awayTeamScore.toString()

                            return(
                                <Card
                                    key={game.id}    
                                    gameId={game.id}
                                    homeTeam={game.homeTeam}
                                    awayTeam={game.awayTeam}
                                    gameTime={format (new Date(game.gameTime), 'H:mm')}
                                    homeTeamScore={home}
                                    awayTeamScore={away}
                                    disabled={true}
                                />)
                        })}

                    </div> 

                </section>
            </main>
        </>
    )
}