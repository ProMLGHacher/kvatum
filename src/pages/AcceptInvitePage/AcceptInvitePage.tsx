import { acceptInviteAction } from "@/features/hubs/model/acceptInvite/acceptInvite"
import Button from "@/shared/ui/Button/Button"
import { useNavigate, useParams } from "react-router-dom"

export const AcceptInvitePage = () => {
    const { inviteHash } = useParams()

    const navigate = useNavigate()

    if (!inviteHash) {
        return <div>Неверная ссылка</div>
    }

    const handleAcceptInvite = () => {
        acceptInviteAction(inviteHash)
        navigate("/main")
    }

    return <div>
        <h1>Привет!</h1>
        <p>Тебя пригласили в хаб</p>
        <p>Теперь ты можешь начать общение с другими участниками</p>
        <Button onClick={handleAcceptInvite}>Перейти в хаб</Button>
    </div>
}