import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
    const { width, height } = useWindowDimensions();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const insets = useSafeAreaInsets();

    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isTablet = width >= 768;
    const isSmallPhone = width < 360;

    const handleGoogleSignIn = async () => {
        if (isSigningIn) return;

        try {
            setIsSigningIn(true);
            setErrorMessage(null);

            if (Platform.OS !== "web") {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const redirectUrl = Linking.createURL("/oauth-native-callback");

            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl,
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });

                if (Platform.OS !== "web") {
                    await Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    );
                }
            }
        } catch (error) {
            console.error("OAuth handshake error:", error);
            setErrorMessage(
                "Unable to continue with Google. Please check your connection and try again."
            );

            if (Platform.OS !== "web") {
                await Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                );
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

            {/* Top Gradient Background */}
            <LinearGradient
                colors={["#0B132B", "#13224A", "#17336F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: isTablet ? height * 0.48 : height * 0.45,
                }}
            />

            {/* Decorative background shapes */}
            <View
                pointerEvents="none"
                className="absolute -right-20 top-12 h-64 w-64 rounded-full bg-white/5"
            />
            <View
                pointerEvents="none"
                className="absolute -left-24 top-36 h-56 w-56 rounded-full bg-blue-300/5"
            />

            <SafeAreaView className="flex-1 pt-16">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: isTablet ? "center" : "space-between",
                        paddingBottom: Math.max(insets.bottom, 24),
                    }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View
                        className={`w-full ${isTablet
                                ? "flex-row items-center justify-center px-12"
                                : "px-5"
                            }`}
                    >
                        {/* Top branding area */}
                        <MotiView
                            from={{ opacity: 0, translateY: -12 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 500 }}
                            className={
                                isTablet
                                    ? "mr-12 max-w-md flex-1"
                                    : "items-center pb-6 pt-4"
                            }
                        >
                            <View
                                className={`mb-4 flex-row items-center ${isTablet ? "justify-start" : "justify-center"
                                    }`}
                            >
                                <View className="h-12 w-12 items-center justify-center rounded-[18px] border border-white/15 bg-white/10">
                                    <Text className="text-lg font-black tracking-tight text-white">
                                        HX
                                    </Text>
                                </View>

                                <View className="ml-3">
                                    <Text className="text-xl font-black tracking-tight text-white">
                                        House
                                        <Text className="text-[#66A6FF]">
                                            Xpertz
                                        </Text>
                                    </Text>

                                    <Text className="mt-0.5 text-[9px] font-bold uppercase tracking-[2px] text-white/50">
                                        Home Services
                                    </Text>
                                </View>
                            </View>

                            <Text
                                className={`font-black tracking-[-1px] text-white ${isTablet
                                        ? "text-left text-5xl leading-[56px]"
                                        : isSmallPhone
                                            ? "text-center text-2xl leading-8"
                                            : "text-center text-3xl leading-10"
                                    }`}
                            >
                                Your home,{"\n"}expertly handled.
                            </Text>

                            <Text
                                className={`mt-2.5 font-medium leading-5 text-blue-100/70 ${isTablet
                                        ? "max-w-sm text-left text-base"
                                        : "max-w-[300px] text-center text-xs"
                                    }`}
                            >
                                Book trusted professionals, manage services, and
                                follow every task from one place.
                            </Text>

                            {isTablet && (
                                <View className="mt-8 space-y-3">
                                    <FeatureLine
                                        icon="shield-checkmark-outline"
                                        text="Verified service professionals"
                                    />
                                    <FeatureLine
                                        icon="calendar-outline"
                                        text="Simple booking and rescheduling"
                                    />
                                    <FeatureLine
                                        icon="notifications-outline"
                                        text="Live service updates"
                                    />
                                </View>
                            )}
                        </MotiView>

                        {/* Login card */}
                        <MotiView
                            from={{
                                opacity: 0,
                                translateY: 28,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                                scale: 1,
                            }}
                            transition={{
                                type: "timing",
                                duration: 550,
                                delay: 120,
                            }}
                            className={`w-full bg-white ${isTablet
                                    ? "max-w-md rounded-[36px] p-10"
                                    : "rounded-[32px] px-6 py-6"
                                }`}
                            style={{
                                shadowColor: "#0B132B",
                                shadowOffset: { width: 0, height: 12 },
                                shadowOpacity: 0.08,
                                shadowRadius: 24,
                                elevation: 8,
                            }}
                        >
                            {!isTablet && (
                                <View className="mb-5 h-1.5 w-10 self-center rounded-full bg-slate-200" />
                            )}

                            <View className="mb-5">
                                <View className="mb-3.5 h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF4FF]">
                                    <Ionicons
                                        name="sparkles-outline"
                                        size={20}
                                        color="#0B3C7A"
                                    />
                                </View>

                                <Text className="text-2xl font-black tracking-tight text-[#0B132B]">
                                    Welcome back
                                </Text>

                                <Text className="mt-1 text-xs font-medium leading-5 text-slate-500">
                                    Continue securely to manage your bookings,
                                    service history, saved addresses, and profile.
                                </Text>
                            </View>

                            {errorMessage && (
                                <MotiView
                                    from={{ opacity: 0, translateY: -8 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    className="mb-4 flex-row items-start rounded-2xl border border-red-100 bg-red-50 px-3.5 py-3"
                                >
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={18}
                                        color="#DC2626"
                                    />

                                    <Text className="ml-2 flex-1 text-xs font-semibold leading-5 text-red-700">
                                        {errorMessage}
                                    </Text>
                                </MotiView>
                            )}

                            <Pressable
                                onPress={handleGoogleSignIn}
                                disabled={isSigningIn}
                                accessibilityRole="button"
                                accessibilityLabel="Continue with Google"
                                style={({ pressed }) => ({
                                    opacity: isSigningIn
                                        ? 0.72
                                        : pressed
                                            ? 0.92
                                            : 1,
                                    transform: [
                                        {
                                            scale:
                                                pressed && !isSigningIn
                                                    ? 0.985
                                                    : 1,
                                        },
                                    ],
                                })}
                                className="overflow-hidden rounded-[18px]"
                            >
                                <LinearGradient
                                    colors={["#0B132B", "#132B59"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="flex-row items-center justify-center px-5"
                                    style={{ height: 54 }}
                                >
                                    {isSigningIn ? (
                                        <>
                                            <ActivityIndicator
                                                size="small"
                                                color="#FFFFFF"
                                            />
                                            <Text className="ml-3 text-xs font-black uppercase tracking-[1.6px] text-white">
                                                Connecting
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-white">
                                                <MaterialCommunityIcons
                                                    name="google"
                                                    size={16}
                                                    color="#4285F4"
                                                />
                                            </View>

                                            <Text className="text-xs font-black uppercase tracking-[1.5px] text-white">
                                                Continue with Google
                                            </Text>

                                            <Ionicons
                                                name="arrow-forward"
                                                size={16}
                                                color="#FFFFFF"
                                                style={{ marginLeft: 8 }}
                                            />
                                        </>
                                    )}
                                </LinearGradient>
                            </Pressable>

                            <View className="mt-4 flex-row items-start">
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={13}
                                    color="#94A3B8"
                                    style={{ marginTop: 1 }}
                                />

                                <Text className="ml-1.5 flex-1 text-[10px] font-medium leading-4 text-slate-400">
                                    Authentication is handled securely through
                                    Google. HouseXpertz never receives your Google
                                    password.
                                </Text>
                            </View>

                            <View className="my-5 flex-row items-center">
                                <View className="h-px flex-1 bg-slate-100" />
                                <Text className="mx-3 text-[9px] font-black uppercase tracking-[1.7px] text-slate-300">
                                    Trusted access
                                </Text>
                                <View className="h-px flex-1 bg-slate-100" />
                            </View>

                            <View className="flex-row justify-between gap-2.5">
                                <TrustItem
                                    icon="shield-checkmark-outline"
                                    label="Secure"
                                />
                                <TrustItem icon="flash-outline" label="Fast" />
                                <TrustItem
                                    icon="people-outline"
                                    label="Verified"
                                />
                            </View>

                            <Text className="mt-6 text-center text-[10px] font-medium leading-4 text-slate-400">
                                By continuing, you agree to the HouseXpertz Terms
                                of Service and Privacy Policy.
                            </Text>
                        </MotiView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function FeatureLine({
    icon,
    text,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
}) {
    return (
        <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                <Ionicons name={icon} size={17} color="#BFDBFE" />
            </View>

            <Text className="ml-3 text-sm font-semibold text-white/75">
                {text}
            </Text>
        </View>
    );
}

function TrustItem({
    icon,
    label,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
}) {
    return (
        <View className="flex-1 items-center rounded-xl bg-slate-50 px-2 py-2.5">
            <Ionicons name={icon} size={16} color="#0B3C7A" />

            <Text className="mt-1 text-[9px] font-black uppercase tracking-[1px] text-slate-500">
                {label}
            </Text>
        </View>
    );
}