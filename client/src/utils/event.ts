import { useEffect } from "react"

interface ClientEvents {
    "notification": [type: "allowed" | "forbidden", content: string]
    "modal": [content: (React.ReactNode | null)]
}

type Event = keyof ClientEvents

export class EventHandler {
    private static eventTable: Partial<{[T in Event]: ((...args: ClientEvents[T]) => void)[]}> = {}

    static addEventListener<T extends Event>(event: T, cb: (...args: ClientEvents[T]) => void) {
        this.eventTable[event] ??= []
        this.eventTable[event]!.push(cb)
    }

    static trigger<T extends Event>(event: T, ...args: ClientEvents[T]) {
        for (const v of this.eventTable[event] ?? []) v(...args)
    }
}

export const useEvent = <T extends Event>(event: T, cb: (...args: ClientEvents[T]) => void) => {
    useEffect(() => {
        EventHandler.addEventListener(event, cb)
    }, [event, cb])
}