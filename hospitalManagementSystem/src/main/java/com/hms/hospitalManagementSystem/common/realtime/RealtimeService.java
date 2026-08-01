package com.hms.hospitalManagementSystem.common.realtime;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RealtimeService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        // Keep-alive timeout set to 24 hours (86400000 ms)
        SseEmitter emitter = new SseEmitter(86400000L);
        this.emitters.add(emitter);

        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
        emitter.onError((e) -> this.emitters.remove(emitter));

        // Send connection success handshake event
        try {
            emitter.send(SseEmitter.event().name("connect").data("connected"));
        } catch (IOException e) {
            this.emitters.remove(emitter);
        }

        return emitter;
    }

    public void broadcast(String eventName, String message) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        for (SseEmitter emitter : this.emitters) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(message));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        this.emitters.removeAll(deadEmitters);
    }
}
