# !/usr/bin/env bash
echo "Starting Test shell Script"

name="Test Script"
age=18

echo $PATH
echo $PWD
echo $SHELL
echo $BASH_VERSION

echo `name: $name, age: $age`

if [ $age -ge 18 ]; then
    echo "You are an adult."
else
    echo "You are a minor."
fi

if [ -f "./scripts/test.sh" ]; then
    echo "The file test.sh exists."
else
    echo "The file test.sh does not exist."
fi

if [ -d "./scripts" ]; then
    echo "The directory scripts exists."
else
    echo "The directory scripts does not exist."
fi

if [ -d "./testsDir" ]; then
    echo "The directory testsDir exists."
else
    echo "The directory testsDir does not exist. Creating it now."
    mkdir ./testsDir
    echo "Directory testsDir created."
    cd ./testsDir
    touch testFile1.txt
    touch testFile2.txt
    echo "Created testFile1.txt and testFile2.txt in testsDir."
    echo "testFile1 content" > testFile1.txt
    echo "testFile2 content" > testFile2.txt
    echo "Added content to testFile1.txt and testFile2.txt."
    echo cat testFile1.txt
    echo cat testFile2.txt
    echo "Listing files in testsDir:"
    ls -l
    cd ..
fi

for i in {1..5}
do
   echo "Iteration $i"
done

