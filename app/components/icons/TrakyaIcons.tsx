/**
 * Trakya Kızanı - özel ikon seti.
 *
 * Fotogerçekçi/illüstratif görsel üretimi bu ortamda mevcut değil, o yüzden
 * marka kimliğini stok ikon veya emoji yerine kendi çizdiğimiz, düz
 * (flat/paper-cut tarzı) vektör şekillerle kuruyoruz: nazar boncuğu, ince
 * belli çay bardağı, kahve fincanı, alev, ayçiçeği ve kızan maskotu.
 *
 * Aynı path/şekil tanımları web tanıtım sayfasındaki (Design canvas) inline
 * SVG'lerle birebir aynı - mobil uygulama ile web arasında görsel tutarlılık
 * için.
 */
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

interface IconProps {
  size?: number;
}

/** Nazar boncuğu - iç içe geçmiş mavi tonlarda halkalar. */
export function NazarIcon({ size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#1B4B8C" />
      <Circle cx="12" cy="12" r="8.6" fill="#EDF3FA" />
      <Circle cx="12" cy="12" r="6.2" fill="#2F6FC4" />
      <Circle cx="12" cy="12" r="3.6" fill="#0E1B2E" />
      <Circle cx="10.6" cy="10.6" r="1.1" fill="#FFFFFF" opacity={0.85} />
    </Svg>
  );
}

/** İnce belli çay bardağı, tabağıyla. */
export function TeaGlassIcon({ size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Ellipse cx="12" cy="20.4" rx="6.4" ry="1.3" fill="#3B2418" opacity={0.35} />
      <Path
        d="M8.2 3 C8.2 3 7.2 7.8 7.2 9.6 C7.2 12.4 9.4 13.4 9.4 15.6 L9.4 19 L14.6 19 L14.6 15.6 C14.6 13.4 16.8 12.4 16.8 9.6 C16.8 7.8 15.8 3 15.8 3 Z"
        fill="#B23B2E"
      />
      <Path
        d="M8.2 3 C8.2 3 7.9 4.4 7.6 5.8 L16.4 5.8 C16.1 4.4 15.8 3 15.8 3 Z"
        fill="#7A1F17"
      />
      <Ellipse cx="12" cy="9.4" rx="4.6" ry="0.9" fill="#E7A23D" opacity={0.9} />
      <Path d="M9.4 19 L14.6 19 L14.6 20.1 L9.4 20.1 Z" fill="#E7A23D" />
    </Svg>
  );
}

/** Kahve/kahvehane fincanı, tüten dumanıyla. */
export function CoffeeCupIcon({ size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4.5 9 H16.5 V15 C16.5 17.8 14.2 20 11.5 20 C8.8 20 6.5 17.8 6.5 15 Z"
        fill="#4A2E1C"
      />
      <Path
        d="M16.5 10.2 C18.3 10.2 19.6 11.3 19.6 12.7 C19.6 14.1 18.3 15.2 16.5 15.2"
        stroke="#4A2E1C"
        strokeWidth={1.4}
        fill="none"
      />
      <Ellipse cx="11.5" cy="9" rx="6" ry="1.1" fill="#E7A23D" />
      <Path
        d="M9 6.4 C8.2 5.3 8.2 4.4 9.1 3.2"
        stroke="#B98A4E"
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />
      <Path
        d="M12.6 6.4 C11.8 5.3 11.8 4.4 12.7 3.2"
        stroke="#B98A4E"
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
    </Svg>
  );
}

/** Alev - "Delirmiş Kızan" seviyesinin yoğunluğu için. */
export function FlameIcon({ size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2 C12 2 6.2 8.6 6.2 13.4 C6.2 17.6 8.8 20.5 12 20.5 C15.2 20.5 17.8 17.6 17.8 13.4 C17.8 8.6 12 2 12 2 Z"
        fill="#C23B2C"
      />
      <Path
        d="M12 7.4 C12 7.4 9 11.4 9 14.2 C9 16.5 10.3 18 12 18 C13.7 18 15 16.5 15 14.2 C15 11.4 12 7.4 12 7.4 Z"
        fill="#E7A23D"
      />
    </Svg>
  );
}

/** Kravat - "Efendi" seviyesi için resmiyet ikonu. */
export function NecktieIcon({ size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9.5 2 H14.5 L13.4 5.4 L14.8 7.2 L12.6 21 C12.4 21.6 11.6 21.6 11.4 21 L9.2 7.2 L10.6 5.4 Z"
        fill="#6B2430"
      />
      <Path d="M9.5 2 H14.5 L13.9 3.8 H10.1 Z" fill="#8C3A4B" />
    </Svg>
  );
}

/** Ayçiçeği - 8 taç yaprağı. */
export function SunflowerIcon({ size = 40 }: IconProps) {
  const petals = Array.from({ length: 8 });
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        {petals.map((_, i) => (
          <G key={i} transform={`rotate(${i * 45} 50 50)`}>
            <Ellipse cx="50" cy="22" rx="9" ry="18" fill="#F2B33D" />
          </G>
        ))}
      </G>
      <Circle cx="50" cy="50" r="16" fill="#5C3826" />
      <Circle cx="50" cy="50" r="16" fill="#5C3826" opacity={0.001} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Circle
          key={i}
          cx={50 + 9 * Math.cos((i / 10) * Math.PI * 2)}
          cy={50 + 9 * Math.sin((i / 10) * Math.PI * 2)}
          r="1.6"
          fill="#3B2418"
        />
      ))}
    </Svg>
  );
}

/** Kızan maskotu - kasketli, bıyıklı düz vektör yüz. */
export function KizanMascotIcon({ size = 96 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="54" r="30" fill="#E3A96B" />
      <Path
        d="M18 48 C18 30 32 18 50 18 C68 18 82 30 82 48 C82 50 81.3 51.6 79.5 51.9 C76 47 63 40 50 40 C37 40 24 47 20.5 51.9 C18.7 51.6 18 50 18 48 Z"
        fill="#2E2620"
      />
      <Path d="M32 40 C40 34 60 34 68 40 L68 44 C60 39 40 39 32 44 Z" fill="#443A30" />
      <Circle cx="39" cy="55" r="2.6" fill="#241A12" />
      <Circle cx="61" cy="55" r="2.6" fill="#241A12" />
      <Path
        d="M28 66 C34 60 40 63 50 63 C60 63 66 60 72 66 C68 61 60 58 50 58 C40 58 32 61 28 66 Z"
        fill="#2E2620"
      />
      <Path
        d="M50 63 C46 68 40 69 34 67 C40 71 47 71 50 68 C53 71 60 71 66 67 C60 69 54 68 50 63 Z"
        fill="#241A12"
      />
    </Svg>
  );
}
