
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'space-grotesk': ['Space Grotesk', 'sans-serif'],
				'jetbrains': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
			},
			colors: {
				// Shadcn/UI compatible colors using CSS variables
				border: 'hsl(var(--border))',
				'border-strong': 'hsl(var(--border-strong))',
				'border-subtle': 'hsl(var(--border-subtle))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				'background-subtle': 'hsl(var(--background-subtle))',
				foreground: 'hsl(var(--foreground))',
				'foreground-muted': 'hsl(var(--foreground-muted))',
				'foreground-subtle': 'hsl(var(--foreground-subtle))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				// Enhanced Grayscale System (20+ shades)
				gray: {
					0: 'hsl(var(--gray-0))',        // #ffffff
					25: 'hsl(var(--gray-25))',      // #fcfcfc
					50: 'hsl(var(--gray-50))',      // #fafafa
					75: 'hsl(var(--gray-75))',      // #f7f7f7
					100: 'hsl(var(--gray-100))',    // #f5f5f5
					150: 'hsl(var(--gray-150))',    // #f0f0f0
					200: 'hsl(var(--gray-200))',    // #ebebeb
					250: 'hsl(var(--gray-250))',    // #e6e6e6
					300: 'hsl(var(--gray-300))',    // #dedede
					350: 'hsl(var(--gray-350))',    // #d6d6d6
					400: 'hsl(var(--gray-400))',    // #cccccc
					450: 'hsl(var(--gray-450))',    // #bfbfbf
					500: 'hsl(var(--gray-500))',    // #a6a6a6
					550: 'hsl(var(--gray-550))',    // #8c8c8c
					600: 'hsl(var(--gray-600))',    // #737373
					650: 'hsl(var(--gray-650))',    // #595959
					700: 'hsl(var(--gray-700))',    // #404040
					750: 'hsl(var(--gray-750))',    // #333333
					800: 'hsl(var(--gray-800))',    // #262626
					850: 'hsl(var(--gray-850))',    // #1a1a1a
					900: 'hsl(var(--gray-900))',    // #121212
					925: 'hsl(var(--gray-925))',    // #0d0d0d
					950: 'hsl(var(--gray-950))',    // #080808
					975: 'hsl(var(--gray-975))',    // #030303
					1000: 'hsl(var(--gray-1000))',  // #000000
				},
				
				// PRAVADO Brand Colors (AI Intelligence)
				'pravado-purple': {
					DEFAULT: 'hsl(var(--pravado-purple))',
					50: 'hsl(var(--pravado-purple-50))',
					100: 'hsl(var(--pravado-purple-100))',
					200: 'hsl(var(--pravado-purple-200))',
					300: 'hsl(var(--pravado-purple-300))',
					400: 'hsl(var(--pravado-purple-400))',
					500: 'hsl(var(--pravado-purple-500))',
					600: 'hsl(var(--pravado-purple-600))',
					700: 'hsl(var(--pravado-purple-700))',
					800: 'hsl(var(--pravado-purple-800))',
					900: 'hsl(var(--pravado-purple-900))',
					light: 'hsl(var(--pravado-purple-light))',
					dark: 'hsl(var(--pravado-purple-dark))',
					subtle: 'hsl(var(--pravado-purple-subtle))',
					muted: 'hsl(var(--pravado-purple-muted))',
				},
				
				// Status Colors
				'status-success': 'hsl(var(--status-success))',
				'status-warning': 'hsl(var(--status-warning))',
				'status-error': 'hsl(var(--status-error))',
				'status-info': 'hsl(var(--status-info))',
				
				// Success Colors
				success: {
					50: 'hsl(var(--success-50))',
					100: 'hsl(var(--success-100))',
					200: 'hsl(var(--success-200))',
					300: 'hsl(var(--success-300))',
					400: 'hsl(var(--success-400))',
					500: 'hsl(var(--success-500))',
					600: 'hsl(var(--success-600))',
					700: 'hsl(var(--success-700))',
				},
				
				// Alert/Error Colors
				alert: {
					50: 'hsl(var(--alert-50))',
					100: 'hsl(var(--alert-100))',
					200: 'hsl(var(--alert-200))',
					300: 'hsl(var(--alert-300))',
					400: 'hsl(var(--alert-400))',
					500: 'hsl(var(--alert-500))',
					600: 'hsl(var(--alert-600))',
					700: 'hsl(var(--alert-700))',
				},
				
				// Warning Colors
				warning: {
					50: 'hsl(var(--warning-50))',
					100: 'hsl(var(--warning-100))',
					200: 'hsl(var(--warning-200))',
					300: 'hsl(var(--warning-300))',
					400: 'hsl(var(--warning-400))',
					500: 'hsl(var(--warning-500))',
					600: 'hsl(var(--warning-600))',
					700: 'hsl(var(--warning-700))',
				},
				
				// Intelligence/Data Colors
				intelligence: {
					50: 'hsl(var(--intelligence-50))',
					100: 'hsl(var(--intelligence-100))',
					200: 'hsl(var(--intelligence-200))',
					300: 'hsl(var(--intelligence-300))',
					400: 'hsl(var(--intelligence-400))',
					500: 'hsl(var(--intelligence-500))',
					600: 'hsl(var(--intelligence-600))',
					700: 'hsl(var(--intelligence-700))',
				},
				
				// Warm Grays (AI & Intelligence Elements)
				'warm-gray': {
					50: 'hsl(var(--warm-gray-50))',
					100: 'hsl(var(--warm-gray-100))',
					200: 'hsl(var(--warm-gray-200))',
					300: 'hsl(var(--warm-gray-300))',
					400: 'hsl(var(--warm-gray-400))',
					500: 'hsl(var(--warm-gray-500))',
					600: 'hsl(var(--warm-gray-600))',
					700: 'hsl(var(--warm-gray-700))',
				},
				
				// Cool Grays (Technical & Data Elements)
				'cool-gray': {
					50: 'hsl(var(--cool-gray-50))',
					100: 'hsl(var(--cool-gray-100))',
					200: 'hsl(var(--cool-gray-200))',
					300: 'hsl(var(--cool-gray-300))',
					400: 'hsl(var(--cool-gray-400))',
					500: 'hsl(var(--cool-gray-500))',
					600: 'hsl(var(--cool-gray-600))',
					700: 'hsl(var(--cool-gray-700))',
				},
				
				// Legacy colors for backward compatibility
				'enterprise-blue': 'hsl(var(--intelligence-600))',
				'soft-gray': 'hsl(var(--gray-50))',
				'professional-gray': 'hsl(var(--gray-700))',
				'border-gray': 'hsl(var(--gray-200))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'xs': 'var(--shadow-xs)',
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'inner': 'var(--shadow-inner)',
				'ai': 'var(--shadow-ai)',
				'ai-hover': 'var(--shadow-ai-hover)',
				'premium': 'var(--shadow-premium)',
				'premium-hover': 'var(--shadow-premium-hover)',
				'purple': 'var(--shadow-purple)',
				'purple-lg': 'var(--shadow-purple-lg)',
				'glow-ai': 'var(--glow-ai)',
				'glow-success': 'var(--glow-success)',
				'glow-alert': 'var(--glow-alert)',
			},
			spacing: {
				'0.5': 'var(--space-0-5)',
				'1': 'var(--space-1)',
				'1.5': 'var(--space-1-5)',
				'2': 'var(--space-2)',
				'2.5': 'var(--space-2-5)',
				'3': 'var(--space-3)',
				'3.5': 'var(--space-3-5)',
				'4': 'var(--space-4)',
				'5': 'var(--space-5)',
				'6': 'var(--space-6)',
				'7': 'var(--space-7)',
				'8': 'var(--space-8)',
				'9': 'var(--space-9)',
				'10': 'var(--space-10)',
				'11': 'var(--space-11)',
				'12': 'var(--space-12)',
				'14': 'var(--space-14)',
				'16': 'var(--space-16)',
				'20': 'var(--space-20)',
				'24': 'var(--space-24)',
				'28': 'var(--space-28)',
				'32': 'var(--space-32)',
			},
			transitionDuration: {
				'instant': 'var(--motion-instant)',
				'micro': 'var(--motion-micro)',
				'short': 'var(--motion-short)',
				'medium': 'var(--motion-medium)',
				'long': 'var(--motion-long)',
				'extra-long': 'var(--motion-extra-long)',
				'ai-pulse': 'var(--motion-ai-pulse)',
			},
			transitionTimingFunction: {
				'standard': 'var(--ease-standard)',
				'decelerate': 'var(--ease-decelerate)',
				'accelerate': 'var(--ease-accelerate)',
				'sharp': 'var(--ease-sharp)',
				'ai-breathing': 'var(--ease-ai-breathing)',
				'confidence': 'var(--ease-confidence)',
			},
			
			// Performance optimizations
			willChange: {
				'transform': 'transform',
				'opacity': 'opacity',
				'transform-opacity': 'transform, opacity',
				'auto': 'auto',
				'scroll': 'scroll-position',
			},
			keyframes: {
				// Enhanced AI-specific animations
				'ai-thinking': {
					'0%, 100%': { 
						opacity: '0.6', 
						transform: 'scale(1)' 
					},
					'50%': { 
						opacity: '1', 
						transform: 'scale(1.02)' 
					}
				},
				'ai-progress-wave': {
					'0%': { 
						transform: 'translateX(-100%) scaleX(0)' 
					},
					'50%': { 
						transform: 'translateX(0%) scaleX(1)' 
					},
					'100%': { 
						transform: 'translateX(100%) scaleX(0)' 
					}
				},
				'ai-confidence-pulse': {
					'0%': { 
						boxShadow: '0 0 0 0 hsl(var(--pravado-purple-400))' 
					},
					'70%': { 
						boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)' 
					},
					'100%': { 
						boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' 
					}
				},
				'ai-success-burst': {
					'0%': { 
						transform: 'scale(1)', 
						opacity: '1' 
					},
					'50%': { 
						transform: 'scale(1.1)', 
						opacity: '0.8' 
					},
					'100%': { 
						transform: 'scale(1)', 
						opacity: '1' 
					}
				},
				'attention-director': {
					'0%, 100%': { 
						transform: 'translateY(0)', 
						boxShadow: 'var(--shadow-sm)' 
					},
					'50%': { 
						transform: 'translateY(-2px)', 
						boxShadow: 'var(--shadow-lg)' 
					}
				},
				'workflow-connection': {
					'0%': { 
						strokeDashoffset: '100' 
					},
					'100%': { 
						strokeDashoffset: '0' 
					}
				},
				'loading-to-success': {
					'0%': { 
						transform: 'rotate(0deg) scale(1)', 
						opacity: '1' 
					},
					'50%': { 
						transform: 'rotate(180deg) scale(0.8)', 
						opacity: '0.5' 
					},
					'100%': { 
						transform: 'rotate(360deg) scale(1)', 
						opacity: '1' 
					}
				},
				'error-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
				},
				'success-confirmation': {
					'0%': { 
						transform: 'scale(0.5)', 
						opacity: '0' 
					},
					'50%': { 
						transform: 'scale(1.1)', 
						opacity: '1' 
					},
					'100%': { 
						transform: 'scale(1)', 
						opacity: '1' 
					}
				},
				// Legacy animations for backward compatibility
				'fadeIn': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slideUp': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scaleIn': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				}
			},
			animation: {
				// AI-specific animations
				'ai-thinking': 'ai-thinking var(--motion-ai-pulse) infinite',
				'ai-progress-wave': 'ai-progress-wave 1.5s ease-in-out infinite',
				'ai-confidence-pulse': 'ai-confidence-pulse 1.5s ease-out infinite',
				'ai-success-burst': 'ai-success-burst var(--motion-medium) var(--ease-confidence)',
				'attention-director': 'attention-director 1s infinite',
				'workflow-connection': 'workflow-connection 2s ease-in-out',
				'loading-to-success': 'loading-to-success var(--motion-medium) var(--ease-confidence)',
				'error-shake': 'error-shake 0.6s ease-in-out',
				'success-confirmation': 'success-confirmation var(--motion-medium) var(--ease-confidence)',
				
				// Legacy animations for backward compatibility
				'fade-in': 'fadeIn 0.6s ease-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'scale-in': 'scaleIn 0.4s ease-out',
			}
		}
	},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("tailwindcss-animate")
	],
} satisfies Config;
