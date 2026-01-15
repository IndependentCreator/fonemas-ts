#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Determine npm registry: use .npmrc if present, otherwise default to npmjs.org
DEFAULT_REGISTRY="https://registry.npmjs.org/"
if [ -f ".npmrc" ] && grep -q "^registry=" .npmrc; then
    NPM_REGISTRY=$(grep "^registry=" .npmrc | head -1 | cut -d'=' -f2-)
elif [ -f "$HOME/.npmrc" ] && grep -q "^registry=" "$HOME/.npmrc"; then
    NPM_REGISTRY=$(grep "^registry=" "$HOME/.npmrc" | head -1 | cut -d'=' -f2-)
else
    NPM_REGISTRY="$DEFAULT_REGISTRY"
fi

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Fonemas - NPM Publish Script${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Get package name from package.json
PACKAGE_NAME=$(node -p "require('./package.json').name")
LOCAL_VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}Package:${NC}  $PACKAGE_NAME"
echo -e "${BLUE}Version:${NC}  $LOCAL_VERSION"
echo -e "${BLUE}Registry:${NC} $NPM_REGISTRY"
echo ""

# Check npm authentication
echo -e "${YELLOW}Checking npm authentication...${NC}"
NPM_USER=$(npm whoami --registry="$NPM_REGISTRY" 2>&1) || true

if [[ "$NPM_USER" == *"ENEEDAUTH"* ]] || [[ "$NPM_USER" == *"not logged in"* ]] || [[ "$NPM_USER" == *"expired"* ]] || [[ -z "$NPM_USER" ]]; then
    echo -e "${RED}You are not logged in to npm.${NC}"
    echo ""
    echo -e "Would you like to login now? Type ${GREEN}yes${NC} to login, anything else to cancel:"
    read -r LOGIN_CONFIRM

    if [ "$LOGIN_CONFIRM" = "yes" ]; then
        echo ""
        echo -e "${YELLOW}Starting npm login...${NC}"
        npm login --registry="$NPM_REGISTRY"

        # Verify login succeeded
        NPM_USER=$(npm whoami --registry="$NPM_REGISTRY" 2>&1) || true
        if [[ "$NPM_USER" == *"ENEEDAUTH"* ]] || [[ "$NPM_USER" == *"not logged in"* ]] || [[ -z "$NPM_USER" ]]; then
            echo -e "${RED}Login failed. Please try again.${NC}"
            exit 1
        fi
        echo -e "${GREEN}Successfully logged in as:${NC} $NPM_USER"
    else
        echo ""
        echo -e "${YELLOW}Publication cancelled. Run ${CYAN}npm login --registry="$NPM_REGISTRY"${YELLOW} to authenticate.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}Logged in as:${NC} $NPM_USER"
fi
echo ""

# Check for latest published version on npm
echo -e "${YELLOW}Checking npm for published versions...${NC}"
PUBLISHED_VERSION=$(npm view "$PACKAGE_NAME" version --registry="$NPM_REGISTRY" 2>/dev/null || echo "not published")

if [ "$PUBLISHED_VERSION" = "not published" ]; then
    echo -e "${YELLOW}This package has not been published to npm yet.${NC}"
else
    echo -e "${BLUE}Published version:${NC} $PUBLISHED_VERSION"

    # Check if local version matches published version
    if [ "$LOCAL_VERSION" = "$PUBLISHED_VERSION" ]; then
        echo ""
        echo -e "${RED}Error: Local version ($LOCAL_VERSION) is the same as the published version.${NC}"
        echo -e "${RED}You must increment the version number before publishing.${NC}"
        echo ""
        echo -e "Update the version in ${CYAN}package.json${NC} using one of these methods:"
        echo -e "  - Edit package.json directly"
        echo -e "  - Run: ${CYAN}npm version patch${NC}  (for bug fixes: x.x.${YELLOW}X${NC})"
        echo -e "  - Run: ${CYAN}npm version minor${NC}  (for new features: x.${YELLOW}X${NC}.0)"
        echo -e "  - Run: ${CYAN}npm version major${NC}  (for breaking changes: ${YELLOW}X${NC}.0.0)"
        exit 1
    fi
fi
echo ""

# Build the project
echo ""
echo -e "${YELLOW}Building the project...${NC}"
pnpm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Aborting publish.${NC}"
    exit 1
fi

echo -e "${GREEN}Build successful!${NC}"
echo ""

# Display package metadata
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Package Metadata to be Published${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

echo -e "${BLUE}Name:${NC}        $(node -p "require('./package.json').name")"
echo -e "${BLUE}Version:${NC}     $(node -p "require('./package.json').version")"
echo -e "${BLUE}Description:${NC} $(node -p "require('./package.json').description")"
echo -e "${BLUE}License:${NC}     $(node -p "require('./package.json').license")"
echo -e "${BLUE}Author:${NC}      $(node -p "require('./package.json').author || '(not set)'")"
echo -e "${BLUE}Homepage:${NC}    $(node -p "require('./package.json').homepage || '(not set)'")"
echo -e "${BLUE}Repository:${NC}  $(node -p "require('./package.json').repository?.url || '(not set)'")"
echo -e "${BLUE}Bugs:${NC}        $(node -p "require('./package.json').bugs?.url || '(not set)'")"
echo -e "${BLUE}Main:${NC}        $(node -p "require('./package.json').main")"
echo -e "${BLUE}Types:${NC}       $(node -p "require('./package.json').types")"
echo -e "${BLUE}Module type:${NC} $(node -p "require('./package.json').type")"
echo ""

echo -e "${BLUE}Keywords:${NC}"
node -p "require('./package.json').keywords.map(k => '  - ' + k).join('\n')"
echo ""

echo -e "${BLUE}Files to include:${NC}"
node -p "require('./package.json').files.map(f => '  - ' + f).join('\n')"
echo ""

echo -e "${BLUE}Exports:${NC}"
node -p "JSON.stringify(require('./package.json').exports, null, 2).split('\n').map(l => '  ' + l).join('\n')"
echo ""

echo -e "${BLUE}Engines:${NC}"
node -p "JSON.stringify(require('./package.json').engines, null, 2).split('\n').map(l => '  ' + l).join('\n')"
echo ""

# Show what files will be published
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Files that will be published${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
npm pack --dry-run 2>&1 | grep -E "^npm notice [0-9]|^npm notice filename" || npm pack --dry-run
echo ""

# Ask for confirmation
echo -e "${CYAN}========================================${NC}"
echo -e "${YELLOW}Do you want to publish ${GREEN}$PACKAGE_NAME@$LOCAL_VERSION${YELLOW} to npm?${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "Type ${GREEN}yes${NC} to confirm, anything else to cancel:"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo ""
    echo -e "${YELLOW}Publication cancelled.${NC}"
    exit 0
fi

# Publish to npm
echo ""
echo -e "${YELLOW}Publishing to npm...${NC}"

# Capture output to detect specific errors
set +e
PUBLISH_OUTPUT=$(npm publish --registry="$NPM_REGISTRY" 2>&1)
PUBLISH_EXIT_CODE=$?
set -e

echo "$PUBLISH_OUTPUT"

# Function to display success message
publish_success() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Successfully published!${NC}"
    echo -e "${GREEN}  $PACKAGE_NAME@$LOCAL_VERSION${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "View at: ${BLUE}https://www.npmjs.com/package/$PACKAGE_NAME${NC}"
}

if [ $PUBLISH_EXIT_CODE -eq 0 ]; then
    publish_success
else
    echo ""
    # Check for OTP requirement (2FA)
    if [[ "$PUBLISH_OUTPUT" == *"EOTP"* ]] || [[ "$PUBLISH_OUTPUT" == *"one-time password"* ]]; then
        echo -e "${YELLOW}Two-factor authentication required.${NC}"
        echo ""
        echo -e "Choose your 2FA method:"
        echo -e "  ${CYAN}1${NC}) Enter OTP code (authenticator app)"
        echo -e "  ${CYAN}2${NC}) Use browser authentication (security key/passkey)"
        echo -e "  ${CYAN}q${NC}) Cancel"
        echo ""
        echo -n "Selection: "
        read -r AUTH_CHOICE

        case "$AUTH_CHOICE" in
            1)
                echo ""
                echo -e "Enter your one-time password:"
                read -r OTP_CODE

                if [ -z "$OTP_CODE" ]; then
                    echo -e "${RED}No OTP provided. Publication cancelled.${NC}"
                    exit 1
                fi

                echo ""
                echo -e "${YELLOW}Retrying publish with OTP...${NC}"
                npm publish --registry="$NPM_REGISTRY" --otp="$OTP_CODE"

                if [ $? -eq 0 ]; then
                    publish_success
                else
                    echo -e "${RED}Publication failed. OTP may have expired - please try again.${NC}"
                    exit 1
                fi
                ;;
            2)
                echo ""
                echo -e "${YELLOW}Opening browser for authentication...${NC}"
                npm publish --registry="$NPM_REGISTRY" --auth-type=web

                if [ $? -eq 0 ]; then
                    publish_success
                else
                    echo -e "${RED}Publication failed. Please try again.${NC}"
                    exit 1
                fi
                ;;
            *)
                echo -e "${YELLOW}Publication cancelled.${NC}"
                exit 0
                ;;
        esac
    # Check for authentication errors
    elif [[ "$PUBLISH_OUTPUT" == *"expired"* ]] || [[ "$PUBLISH_OUTPUT" == *"revoked"* ]] || [[ "$PUBLISH_OUTPUT" == *"ENEEDAUTH"* ]]; then
        echo -e "${RED}Authentication error detected.${NC}"
        echo -e "${YELLOW}Your npm access token has expired or been revoked.${NC}"
        echo ""
        echo -e "Would you like to login again and retry? Type ${GREEN}yes${NC} to continue:"
        read -r RETRY_LOGIN

        if [ "$RETRY_LOGIN" = "yes" ]; then
            echo ""
            echo -e "${YELLOW}Starting npm login...${NC}"
            npm login --registry="$NPM_REGISTRY"

            # Verify login succeeded
            NPM_USER=$(npm whoami --registry="$NPM_REGISTRY" 2>&1) || true
            if [[ "$NPM_USER" == *"ENEEDAUTH"* ]] || [[ -z "$NPM_USER" ]]; then
                echo -e "${RED}Login failed. Please try again.${NC}"
                exit 1
            fi
            echo -e "${GREEN}Successfully logged in as:${NC} $NPM_USER"
            echo ""
            echo -e "${YELLOW}Retrying publish...${NC}"
            npm publish --registry="$NPM_REGISTRY"

            if [ $? -eq 0 ]; then
                publish_success
            else
                echo -e "${RED}Publication failed after re-login.${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}Run ${CYAN}npm login --registry="$NPM_REGISTRY"${YELLOW} and try again.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Publication failed!${NC}"
        exit 1
    fi
fi
