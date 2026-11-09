package com.scom.jpa.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " introuvable avec l'identifiant : " + id);
    }
    public ResourceNotFoundException(String message) { super(message); }
}
