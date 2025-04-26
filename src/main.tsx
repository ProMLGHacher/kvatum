import "@/app/styles/index.scss"
import { createRoot } from "react-dom/client"
import { App } from "@/app/App"

// import * as Sentry from "@sentry/react"
// import { isActionError } from "./shared/types/actionErrorType/ActionError"

// Sentry.init({
//   dsn: "https://4dc814346b860d4284bfa4956780345f@sentry.araik.dev/2",
//   integrations: [Sentry.browserTracingIntegration()],
//   tracesSampleRate: 1.0,
//   profilesSampleRate: 1.0,
//   beforeSend: (event, hint) => {
//     const exception = hint.originalException

//     if (isActionError(exception)) {
//       alert(exception.message)
//       event.fingerprint = ["{{ default }}", exception.message]
//     }

//     return event
//   },
// })

createRoot(document.getElementById("root")!).render(<App />)
