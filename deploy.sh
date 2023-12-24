#!/bin/bash

echo "--------------------------------------------------"
echo "--- Test Build Production ---"
echo "--------------------------------------------------"
<<<<<<< HEAD
pnpm run build
=======
pnpm build
>>>>>>> production

echo "--------------------------------------------------"
echo "--- [0] Checkout Dev & Commit code ---"
echo "--------------------------------------------------"
git pull
git checkout dev
git commit -m "Update code of brand Dev before deploy Production"
git push origin dev

echo ""
echo ""

echo "--------------------------------------------------"
echo "--- [1] Checkout & Pull production ---"
echo "--------------------------------------------------"
git checkout production
git pull

echo ""
echo ""

echo "--------------------------------------------------"
echo "--- [2] Merge Dev -> Production ---"
echo "--------------------------------------------------"
git merge dev -m "Merge dev into production"
git add -A
git commit -m "Release production"

echo ""
echo ""

echo "--------------------------------------------------"
echo "--- [3] Push and Deploy Production ---"
echo "--------------------------------------------------"
git push origin production

echo ""
echo ""

echo "--------------------------------------------------"
echo "--- [4] Checkout Dev & Merge Production ---"
echo "--------------------------------------------------"
<<<<<<< HEAD
git checkout dev
git merge production -m "Merge Production into Dev"
git add -A
git commit -m "Release dev"
git push origin dev
=======
git checkout dev-2
git merge production -m "Merge Production into Dev"
git add -A
git commit -m "Release dev"
git push origin dev-2
>>>>>>> production

echo ""
echo ""

version=$(grep -o '"version": "[^"]*' package.json | awk -F'"' '{print $4}')

# Xử lý việc xoá các bundle
IFS='.' read -r major minor patch <<< "$version"
new_patch=$((patch - 2))
if [ "$new_patch" -lt 0 ]; then
    new_patch=0
    new_minor=$((minor - 2))
    if [ "$new_minor" -lt 0 ]; then
        new_minor=0
    fi
else
    new_minor="$minor"
fi

old_version="$major.$new_minor.$new_patch"

unset IFS

# echo "--------------------------------------------------"
# echo "--- [5] Push Capgo (Do CapGo bị lỗi) ---"
# echo "--------------------------------------------------"
# npx @capgo/cli@latest bundle upload -a '9116fd16-36f7-4159-8207-400e876c52a2'


echo "--------------------------------------------------"
echo "--- [6] Remove old version: $old_version ---"
echo "--------------------------------------------------"
<<<<<<< HEAD
curl --location --request DELETE "https://api.capgo.app/bundle?app_id=chatbox.botbanhang.vn&version=$old_version" \
--header 'authorization: 9116fd16-36f7-4159-8207-400e876c52a2'


# echo "--------------------------------------------------"
# echo "--- [7] Zip & Delpoy Merchant.vn (Do CapGo bị lỗi) ---"
# echo "--------------------------------------------------"
# rm deploy.zip
# zip -r deploy.zip ./dist/* 
# curl --location 'http://deploy.merchant.vn/upload' \
# --header 'Authorization: kfwaejkrjewkoarji' \
# --form 'file=@"./deploy.zip"'
=======
curl --location --request DELETE "https://api.capgo.app/bundle?app_id=vn.merchant.app&version=$old_version" \
--header 'authorization: 9116fd16-36f7-4159-8207-400e876c52a2'


echo "--------------------------------------------------"
echo "--- [7] Zip & Delpoy Merchant.vn (Do CapGo bị lỗi) ---"
echo "--------------------------------------------------"
rm deploy.zip
zip -r deploy.zip ./dist/* 
curl --location 'http://deploy.merchant.vn/upload' \
--header 'Authorization: kfwaejkrjewkoarji' \
--form 'file=@"./deploy.zip"'
>>>>>>> production

echo ""
echo ""

echo "============ $version ============"
echo "--- 🔥 Deploy success new version : $version ! 🔥 ---"
echo "Kiểm tra version sau 2 ~ 3 deploy phút tại : https://merchant.vn/business_list "
