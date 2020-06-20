package com.threadjava.users;

import com.threadjava.users.dto.UserShortDto;
import com.threadjava.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;

public interface UsersRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.username = :name WHERE u.id = :id")
    void setUserNameById(@Param("id") UUID id, @Param("name") String name);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.avatar.id = :imageId WHERE u.id = :id")
    void setUserAvatar(@Param("id") UUID id, @Param("imageId") UUID imageId);

    @Query("select new com.threadjava.users.dto.UserShortDto(u.id, u.username) " +
            "from User u WHERE u.id = :id")
    UserShortDto findByIdDto(@Param("id") UUID id);

}
