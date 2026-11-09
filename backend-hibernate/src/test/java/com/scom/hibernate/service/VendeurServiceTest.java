package com.scom.hibernate.service;

import com.scom.hibernate.dto.VendeurRequest;
import com.scom.hibernate.dto.VendeurResponse;
import com.scom.hibernate.entity.Vendeur;
import com.scom.hibernate.exception.ResourceNotFoundException;
import com.scom.hibernate.mapper.VendeurMapper;
import com.scom.hibernate.repository.VendeurRepository;
import com.scom.hibernate.service.impl.VendeurServiceImpl;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VendeurServiceTest {

    private final VendeurRepository repo = mock(VendeurRepository.class);
    private final VendeurMapper mapper = new VendeurMapper();
    private final VendeurService service = new VendeurServiceImpl(repo, mapper);

    @Test
    void findById_returnsVendeur() {
        Vendeur v = Vendeur.builder().idVendeur(1L).codeVendeur("V001").nomVendeur("Doe").build();
        when(repo.findById(1L)).thenReturn(Optional.of(v));
        VendeurResponse r = service.findById(1L);
        assertThat(r.nomVendeur()).isEqualTo("Doe");
    }

    @Test
    void findById_missing_throws() {
        when(repo.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.findById(999L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_persists() {
        VendeurRequest req = new VendeurRequest(2L, "V002", "Jane", "Roe", "j@r.com", "+212", "Rabat");
        when(repo.existsById(2L)).thenReturn(false);
        when(repo.save(any(Vendeur.class))).thenAnswer(inv -> inv.getArgument(0));
        VendeurResponse r = service.create(req);
        assertThat(r.codeVendeur()).isEqualTo("V002");
        verify(repo).save(any(Vendeur.class));
    }
}
