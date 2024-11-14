package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type JwtClaim struct {
	Name string `json:"name"`
	jwt.StandardClaims
}

var (
	key           = []byte(os.Getenv("JWT_TOKEN_SECRET"))
	jwtvalidClaim *JwtClaim
	jwtclim       JwtClaim
)

// GenerateJwt will generate a token using a secret key and return the token.
func GenerateJwt(name string) (jwtToken string) {
	expiryTime := time.Now().Add(1 * time.Hour)
	jwtclaim := JwtClaim{
		Name: name,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiryTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtclaim)
	jwtToken, err := token.SignedString(key)
	if err != nil {
		return ""
	}
	return
}

// ValidateToken will validate the incoming token with the generated token."
func ValidateToken(jwtToken string) (string, error) {
	var (
		ok bool
	)
	jwtclim = JwtClaim{}
	token, err := jwt.ParseWithClaims(jwtToken, &jwtclim, func(t *jwt.Token) (interface{}, error) {
		return key, nil
	})

	if err != nil {
		return "", err
	}

	if jwtvalidClaim, ok = token.Claims.(*JwtClaim); !ok {
		return "", errors.New("parsing error")
	}

	if jwtvalidClaim.ExpiresAt < time.Now().Unix() {
		return "", errors.New("token expired")
	}

	return jwtvalidClaim.Name, nil
}
