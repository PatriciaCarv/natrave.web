import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useLocalStorage } from 'react-use'

const validationSchema = yup.object().shape({
    homeTeamScore: yup.string().required(),
    awayTeamScore: yup.string().required()
  })


export const Card = ({disabled, gameId, homeTeam, awayTeam, homeTeamScore, awayTeamScore, gameTime} ) =>{
    const [auth] = useLocalStorage('auth')
    const formik = useFormik({        
        onSubmit: (values) => {
            values.homeTeamScore = values.homeTeamScore.toString()
            values.awayTeamScore = values.awayTeamScore.toString()
            axios({
                method: 'post',
                baseURL: import.meta.env.VITE_API_URL,
                url: '/hunches',
                headers: {
                    authorization: `Bearer ${auth.accessToken}`
                },
                data: {
                    ...values,
                    gameId
                }
            })
        },
        initialValues: {
            homeTeamScore,
            awayTeamScore
        },
        validationSchema
    })
    return (
        <div className="rounded-xl border border-grey-300 p-4 text-center space-y-4">
            <span className="text-sn md:text-base text-gray-700 font-bold">{ gameTime }</span>

            <form className="flex space-x-4 justify-center itens-center">
                <span className="uppercase">{homeTeam}</span>
                <img src={`/imgs/flags/${homeTeam}.png`}/>

                <input 
                    className="bg-red-300/[0.2] w-[55px] h-[55px] text-red-700 text-xl text-center"
                    type="number"
                    name="homeTeamScore"
                    value={formik.values.homeTeamScore} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleSubmit}
                    disabled={disabled}
                />
                
                <span className="text-red-300 font-bold">X</span>
                <input 
                    className="bg-red-300/[0.2] w-[55px] h-[55px] text-red-700 text-xl text-center"
                    type="number" 
                    name="awayTeamScore"
                    value={formik.values.awayTeamScore} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleSubmit}
                    disabled={disabled}
                />

                <img src={`/imgs/flags/${awayTeam}.png`}/>
                <span className="uppercase">{awayTeam}</span>
                        
            </form>
        </div>
    )
}