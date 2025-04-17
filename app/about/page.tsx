/* eslint-disable react/no-unescaped-entities */

export default function About() {
  return (
    <div className="px-10 py-20 mb-5">
      <h2 className="text-rose-500 text-xl mb-6">À propos</h2>
      <div className="text-black">
        <p className="sm:w-3/4 w-full text-sm font-light  mb-4">
          Ce site est né du souhait d&apos;archiver le compte Instagram
          <a
            className="text-rose-500 px-1 hover:underline"
            href="https://www.instagram.com/lawrens_shyboi/"
          >
            @lawrens_shyboi
          </a>
          que j&apos;ai créé en fin 2019 et que j&apos;ai géré jusqu&apos;en
          2023. J&apos;y partageais des références de films, de séries et
          d&apos;émissions télé qui mettaient en scène des personnes LGBTQI+ ou
          traitaient de sujets multiples entourant ces communautés.
          <br /> Je crois que les images ont beaucoup à nous dire de
          l&apos;histoire qui nous précède et du présent dans lequel nous
          vivons. Alors montrer la richesse et la diversité des films qui
          existent et des sujets abordés semblait essentiel.
          <br /> Afin de préserver les multiples références collectées et
          partagées au fil du temps grâce aux communautés (LGBTQI+ et
          d&apos;autres), j&apos;ai pensé que développer un site avec une base
          de données propre serait la solution la plus viable et accessible.
        </p>
      </div>
    </div>
  );
}
