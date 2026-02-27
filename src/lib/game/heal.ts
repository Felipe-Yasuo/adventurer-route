export function clampHeal(life: number, maxLife: number, healValue: number) {
    const newLife = Math.min(maxLife, life + healValue);
    return { newLife, healed: newLife - life };
}